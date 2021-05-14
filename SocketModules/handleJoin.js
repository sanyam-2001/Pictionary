const getUsersInRoom = require('./getUsersInRoom')
const handleJoin = async (db, socket, io, data) => {
    const { username, room, isAdmin } = data;
    //Admin Creates Room
    if (isAdmin) {
        await db.collection('room').doc(room).set({
            adminID: socket.id,
            roomID: room
        })
    }
    //Everybody joins Room
    await db.collection('room').doc(room).collection('users').doc(socket.id).set({
        username,
        id: socket.id,
        points: 0,
        hadTurn: false,
        hasGuessed: false,
        isOngoingTurn: false
    })
    const users = await getUsersInRoom(db, room);
    await socket.join(room)
    io.in(room).emit('userJoined', { userList: users, joinedUsername: username });

}

module.exports = handleJoin