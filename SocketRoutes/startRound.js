const { getUsersInRoom } = require('./joinRoom');
const getWords = require('../getWords');

const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
//Sends Word and Turn
const startRound = async (db, room, io) => {
    const arr = await getUsersInRoom(db, room)
    let user;
    for (let i = 0; i < arr.length; i++) {
        if (!arr[i].turn) {
            user = arr[i];
            await db.collection('room').doc(room).collection('users').doc(user.id).update({
                turn: true,
                guessed: true
            })
            break;
        }
    }
    if (!user) {
        arr.forEach(async (u) => {
            await db.collection('room').doc(room).collection('users').doc(u.id).update({
                turn: false
            })
        })
        return startRound(db, room, io)

    }




    let word = getWords(randomNumber(3, 10))[0];

    arr.forEach(async (u) => {
        if (u.id === user.id) {
            await db.collection('room').doc(room).collection('users').doc(u.id).update({
                ongoingTurn: true
            })
            io.to(user.id).emit('drawGetWord', { word, drawer: user.username });
        }
        else {
            await db.collection('room').doc(room).collection('users').doc(u.id).update({
                ongoingTurn: false
            })
            io.to(u.id).emit('guessGetWord', { word, drawer: user.username });
        }
    })
}

module.exports = startRound