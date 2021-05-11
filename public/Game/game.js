const socket = io()
let secretWord = '';
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room')
const isAdmin = urlParams.get('isAdmin')
if (isAdmin === '1') {
    $("#adminOnly").fadeIn();
}
socket.emit('joinRoom', { room, username, isAdmin })


socket.on('userJoined', (e) => {
    console.log(e)
    let prev = $('.guess-container').html()
    prev += `<div class="text-success border rounded p-2 my-1">${e}</div>    `
    $('.guess-container').html(prev)
})
socket.on('userLeft', (e) => {
    console.log(e)
    let prev = $('.guess-container').html()
    prev += `<div class="text-danger border rounded p-2 my-1">${e}</div>    `
    $('.guess-container').html(prev)
})

socket.on('updatedUsers', (e) => {
    let htm = ''
    e.forEach(user => {
        htm += `<div class="border p-1 my-2" id=${user.id}>
        <i class="fas fa-user-circle mx-2"></i>${user.username}
    </div>`
    })
    $('.user-container').html(htm)
})
//Initial Start
$('#start').on('click', () => {
    socket.emit('adminStartsRound')
})
//FadeOut
socket.on('preRoundStart', () => {
    $('.popups').fadeOut()
    $('.startGame').fadeOut()
})

//People Get Words
socket.on('drawGetWord', ({ word, drawer }) => {
    Timer = 120
    console.log(word)
    $('#show-word').html(word)
    canDraw = true;
    $('.drawer').text(drawer)
    $('.popups').fadeIn();
    $('.info').fadeIn();
    setTimeout(() => { $('.popups').fadeOut() }, 2000)
})
socket.on('guessGetWord', ({ word, drawer }) => {
    Timer = 120
    let hiddenWord = '';
    for (let i = 0; i < word.length; i++) {
        hiddenWord += '_ ';
    }
    $('#show-word').html(hiddenWord)
    secretWord = word;
    canDraw = false;
    $('.drawer').text(`${drawer} is drawing!`)
    $('.popups').fadeIn();
    $('.info').fadeIn();
    setTimeout(() => { $('.popups').fadeOut() }, 2000)
})


socket.on('drawToGuessers', (e) => {
    ctx.lineCap = 'round'
    ctx.strokeStyle = e.color;
    ctx.lineWidth = e.lineWidth
    ctx.lineTo(e.x, e.y)
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.x, e.y)
})
socket.on('mouseUp', () => {
    ctx.beginPath();
})
socket.on('eraseAll', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})
$('#guessVal').on('keydown', (e) => {
    if (e.key === "Enter") {
        socket.emit('userGuess', { guess: $('#guessVal').val(), secretWord, username })
        $('#guessVal').val("")
    }
})
socket.on('wrongGuess', (e) => {
    console.log(e)
    let prev = $('.guess-container').html()
    prev += `<div class="border rounded p-2 my-1">${e}</div>    `
    $('.guess-container').html(prev)
})
socket.on('rightGuess', (e) => {
    console.log(e)
    let prev = $('.guess-container').html()
    prev += `<div class="text-success border rounded p-2 my-1">${e}</div>    `
    $('.guess-container').html(prev)
})
socket.on('timer', timer => {
    $('#gametime').text(timer)
    if (timer === 5) {
        $('.drawer').text(`The Word was ${secretWord}`)
        $('.popups').fadeIn();
        $('.info').fadeIn();
        setTimeout(() => { $('.popups').fadeOut() }, 2000)
    }
})












//Draw Functions
function draw(e) {
    socket.emit('drawingToAll', { color, lineWidth, x: Math.floor(e.clientX - canvas.getBoundingClientRect().left), y: Math.floor(e.clientY - canvas.getBoundingClientRect().top) })
    ctx.lineCap = 'round'
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth
    ctx.lineTo(Math.floor(e.clientX - canvas.getBoundingClientRect().left), Math.floor(e.clientY - canvas.getBoundingClientRect().top))
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(Math.floor(e.clientX - canvas.getBoundingClientRect().left), Math.floor(e.clientY - canvas.getBoundingClientRect().top))
}
canvas.addEventListener('mouseup', () => {
    mouseDown = false;
    ctx.beginPath();
    if (canDraw) {
        socket.emit('mouseUp')
    }
})
$('.fa-trash').on('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('eraseAll')
})

setInterval(() => {
    Timer--;
    if (Timer >= 0 && canDraw) { socket.emit('timer', Timer) }
    else { Timer = 120; }
}, 1000)


$('#copyID').on('click', () => {

    const elem = document.createElement('textarea');
    elem.value = room;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);

})


