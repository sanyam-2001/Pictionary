$('#joinBtn').on('click', () => {
    const username = $('#joinUsername').val()
    const room = $('#room').val()
    if (username.length < 2 || room.length !== 10) {
        popup('Invalid inputs', 'Username Should not be Empty and The Code should be Valid');
    }
    else window.open(`./Game/game.html?username=${username}&room=${room}&isAdmin=0`)
})

$('#createBtn').on('click', () => {
    const username = $('#createUsername').val();
    if (username.length < 2) {
        popup('Invalid inputs', 'Username Should not be Empty');
    }
    else window.open(`./Game/game.html?username=${username}&room=${getRandomString(10)}&isAdmin=1`)
})

function popup(header, message) {
    $('.modal-title').text(header)
    $('.modal-body').text(message)
    $('.popup').fadeIn();
}
function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

$('#closePop').on('click', () => { $('.popup').fadeOut() })
