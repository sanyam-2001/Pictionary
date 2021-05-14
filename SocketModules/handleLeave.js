const getUsersInRoom = require('./getUsersInRoom')
const startRound = require('./startRound')
const handleLeave = async (db, socket, io, data) => {
    const { room, username } = data;
    await db.collection('room').doc(room).collection('users').doc(socket.id).delete();
    const users = await getUsersInRoom(db, room);
    let didDrawerLeave = true;
    users.forEach(user => {
        if (user.isOngoingTurn) {
            didDrawerLeave = false;
        }
    })
    //If Room is Empty, Delete
    if (users.length === 0) {
        await db.collection('room').doc(room).delete()
    }
    //Else Send Updated List
    else {
        socket.to(room).emit('userLeft', { userList: users, leavingUsername: username });
    }
    if (didDrawerLeave) {
        startRound(db, io, room);
    }

}

module.exports = handleLeave;