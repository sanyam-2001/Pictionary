function getRandomString(length) {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

document.getElementById('create').addEventListener('click', () => {
    const username = document.getElementById('usernameCreate');
    if (username.value.length < 4) {
        toast('Invalid credentials')
    }
    else {
        window.open(`./Game/game.html?username=${username.value}&room=${getRandomString(16)}&isAdmin=true`)
    }

})

document.getElementById('join').addEventListener('click', () => {
    const username = document.getElementById('usernameJoin');
    const room = document.getElementById('roomJoin');
    if (username.value.length < 4 || room.value.length !== 16) {
        toast('Invalid credentials')
    }
    else {
        window.open(`./Game/game.html?username=${username.value}&room=${room.value}&isAdmin=false`)
    }

})


function toast(html) {
    $('.popup').fadeIn(200)
    gsap.from('.popup', { transform: 'translateY(-100%)' })
    $('.popup').text(html)
    setTimeout(() => { $('.popup').fadeOut(200) }, 2000)
}