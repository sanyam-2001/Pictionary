const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const admin = require("firebase-admin");
const serviceAccount = require("./skribbl-6fa76-firebase-adminsdk-eidsg-7275e7338a.json");
const { joinRoom, createAndJoinRoom, getUsersInRoom } = require('./SocketRoutes/joinRoom')
const startRound = require('./SocketRoutes/startRound');
const handleGuess = require('./SocketRoutes/handleRound')
//Initialize App and DB
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()
//Initialize Web-Socket
const app = express();
const server = http.createServer(app);
const io = socketio(server)
app.use(express.static(path.join(__dirname, 'public')))
io.on('connection', (socket) => {
    socket.on('joinRoom', async ({ room, username, isAdmin }) => {
        if (isAdmin === '1') {
            await createAndJoinRoom(db, socket, room, username)
        }
        else {
            await joinRoom(db, socket, room, username)
        }
        await socket.join(room)
        await io.in(room).emit('userJoined', `${username} has joined the Room!`)
        let updatedUserArr = await getUsersInRoom(db, room);
        await io.in(room).emit('updatedUsers', updatedUserArr)

        socket.on('adminStartsRound', async () => {
            io.in(room).emit('preRoundStart');
            await startRound(db, room, io);
        })

        socket.on('drawingToAll', (e) => {
            socket.to(room).emit('drawToGuessers', e);
        })
        socket.on('mouseUp', () => { socket.to(room).emit('mouseUp') })
        socket.on('eraseAll', () => { socket.to(room).emit('eraseAll') })
        socket.on('userGuess', (guess) => {
            handleGuess(db, socket, room, io, guess)
        })
        socket.on('timer', (timer) => {
            io.in(room).emit('timer', timer);
            if (timer == 0) {
                startRound(db, room, io);
            }
        })









        socket.on('disconnect', async () => {
            const disconnectedUser = await db.collection('room').doc(room).collection('users').doc(socket.id).get()
            const data = await disconnectedUser.data();
            await db.collection('room').doc(room).collection('users').doc(socket.id).delete();
            let updatedUserArr = await getUsersInRoom(db, room);
            if (updatedUserArr.length === 0) {
                db.collection('room').doc(room).delete()
            }
            await socket.to(room).emit('updatedUsers', updatedUserArr)
            await socket.to(room).emit('userLeft', `${username} has left the Room!`)
            if (data.ongoingTurn) {
                startRound(db, room, io)
            }

        })

    })

})


server.listen(process.env.PORT || 3000)

