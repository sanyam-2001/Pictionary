const getUsersInRoom = async (db, room) => {
    const snapshot = await db.collection('room').doc(room).collection('users').orderBy('points', 'desc').get()
    let arr = [];
    snapshot.docs.forEach(doc => {
        arr.push(doc.data())
    })
    return arr;
}
module.exports = getUsersInRoom