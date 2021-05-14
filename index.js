const express = require('express');
const socketio = require('socket.io');
const path = require('path');
const http = require('http');
const admin = require("firebase-admin");
const serviceAccount = require("./skribbl-6fa76-firebase-adminsdk-eidsg-7275e7338a.json");
const handleJoin = require('./SocketModules/handleJoin')
const handleLeave = require('./SocketModules/handleLeave')
const startRound = require('./SocketModules/startRound')
const handleGuess = require('./SocketModules/handleGuess')
//Initialize App and DB
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();


//Initialize Web-Socket
const app = express();
const server = http.createServer(app);
const io = socketio(server);


//Public Initialization
app.use(express.static(path.join(__dirname, 'public')));


//IO Code block
io.on('connection', (socket) => {
    //Initial Event
    socket.on('joinRoom', (data) => {
        const { username, room } = data

        //Handle Join Room
        handleJoin(db, socket, io, data);
        //Admin Starts For the first Time
        socket.on('adminStart', () => {
            io.in(room).emit('adminStart')
            //StartRound
            startRound(db, io, room);
        });
        //Drawing Events
        socket.on('propagateDrawing', (e) => {
            socket.to(room).emit('propagateDrawing', e);
        })
        socket.on('mouseup', () => socket.to(room).emit('mouseup'))
        socket.on('clearScreen', () => socket.to(room).emit('clearScreen'))

        //User Guesses
        socket.on('userGuessesWord', (e) => {
            handleGuess(db, socket, io, e, room);
        })
        socket.on('timeOut', () => {
            setTimeout(() => startRound(db, io, room), 2500);
        });

        socket.on('disconnect', () => {

            handleLeave(db, socket, io, data);
        });



    });
});


server.listen(process.env.PORT || 5000);