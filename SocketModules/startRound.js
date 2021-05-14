const getUsersInRoom = require('./getUsersInRoom')
const getWords = require('../getWords')
const startRound = async (db, io, room) => {
    io.in(room).emit('clearScreen');
    const users = await getUsersInRoom(db, room);
    io.in(room).emit('updatingPoints', { users })
    let userTurn = null;
    users.forEach(async (user) => {
        await db.collection('room').doc(room).collection('users').doc(user.id).update({
            isOngoingTurn: false
        })
    })


    //Find a User that has not yet had a Turn

    for (let i = 0; i < users.length; i++) {
        if (!users[i].hadTurn) {
            userTurn = users[i];
            await db.collection('room').doc(room).collection('users').doc(users[i].id).update({
                hadTurn: true,
                hasGuessed: true,
                isOngoingTurn: true
            })
            break;
        }
    }
    //Reset Round
    if (userTurn === null) {
        users.forEach(async (user) => {
            await db.collection('room').doc(room).collection('users').doc(user.id).update({
                hadTurn: false
            });
        });
        return startRound(db, io, room)
    }
    const word = getWords();
    users.forEach((user) => {
        if (user.id === userTurn.id) {
            io.to(user.id).emit('toDrawer', { word, userTurn });
        }
        else {
            io.to(user.id).emit('toGuesser', { word, userTurn });
        }
    });
}

module.exports = startRound;