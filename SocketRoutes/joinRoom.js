const createAndJoinRoom = async (db, socket, room, username) => {
    await db.collection('room').doc(room).set({
        adminSocketID: socket.id
    })
    await db.collection('room').doc(room).collection('users').doc(socket.id).set({
        id: socket.id,
        username: username,
        isAdmin: true,
        turn: false,
        guessed: false,
        ongoingTurn: false
    })
}
const joinRoom = async (db, socket, room, username) => {
    await db.collection('room').doc(room).collection('users').doc(socket.id).set({
        id: socket.id,
        username: username,
        isAdmin: false,
        turn: false,
        guessed: false,
        ongoingTurn: false
    })
}
async function getUsersInRoom(db, room) {
    const snapshot = await db.collection('room').doc(room).collection('users').get();
    let arr = []
    snapshot.docs.forEach(doc => {
        const item = doc.data();
        arr.push(item)
    })
    return arr
}




module.exports = { joinRoom, createAndJoinRoom, getUsersInRoom }