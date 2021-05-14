const getUsersInRoom = require('./getUsersInRoom');
const startRound = require('./startRound')
const handleGuess = async (db, socket, io, e, room) => {
    const { username, secretWord, guess, Time } = e;
    if (secretWord.toLowerCase() === guess.toLowerCase()) {
        const snapshot = await db.collection('room').doc(room).collection('users').doc(socket.id).get();
        const points = snapshot.data()

        await db.collection('room').doc(room).collection('users').doc(socket.id).update({
            hasGuessed: true,
            points: points.points + (Time * 10)
        });
        const userArr = await getUsersInRoom(db, room);
        let notGuessed = 0;
        userArr.forEach(user => {
            if (!user.hasGuessed) {
                notGuessed++;
            }
        });
        if (notGuessed === 0) {
            io.in(room).emit('rightGuess', { username });
            //Everybody Has Guessed
            userArr.forEach(async (user) => {
                await db.collection('room').doc(room).collection('users').doc(user.id).update({
                    hasGuessed: false
                })
            });
            io.in(room).emit('revealWord')
            return setTimeout(() => { startRound(db, io, room) }, 2500)
        }
        else {
            io.in(room).emit('rightGuess', { username });
        }
    }
    else {
        io.in(room).emit('wrongGuess', { username, guess });
    }


}

module.exports = handleGuess