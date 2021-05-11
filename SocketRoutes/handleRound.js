const { getUsersInRoom } = require("./joinRoom");
const startRound = require('./startRound')

const handleGuess = async (db, socket, room, io, guess) => {
    if (guess.guess.toLowerCase() === guess.secretWord.toLowerCase()) {
        await db.collection('room').doc(room).collection('users').doc(socket.id).update({
            guessed: true
        })
        let arr = await getUsersInRoom(db, room);
        io.in(room).emit('rightGuess', `${guess.username} guessed the word!`)
        let ctr = 0;
        arr.forEach(user => {
            if (!user.guessed) ctr++;
        })
        if (ctr === 0) {
            arr.forEach(async (user) => {
                await db.collection('room').doc(room).collection('users').doc(user.id).update({
                    guessed: false
                })
            })
            startRound(db, room, io);
        }

    }
    else {
        io.in(room).emit('wrongGuess', `${guess.username}: ${guess.guess}`);
    }
}
module.exports = handleGuess