//DOM Init and Utility Functions
if (isAdmin) {
    $('#adminsOnly').fadeIn();
}

$('#copyRoom').on('click', () => {
    copyToClipboard(room);
    toast();
})
//User joins Room
socket.emit('joinRoom', {
    username,
    room,
    isAdmin
});

//New User joined
socket.on('userJoined', ({ userList, joinedUsername }) => {
    let prev = $('.chat-container').html();
    prev += `<div class="text-success p-1 my-2 border rounded text-center">${joinedUsername} Joined the Room</div>`
    $('.chat-container').html(prev);
    document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight
    let htm = '';
    userList.forEach((user, i) => {
        let color = 'white';
        if (i + 1 == 1) color = 'gold';
        else if (i + 1 == 2) color = 'silver'
        else if (i + 1 == 3) color = 'brown'
        htm +=
            `<div class="p-1 my-2 border rounded" style="background-color:${color};">
            <div><i class="fas fa-user mr-3"></i>${user.username}</div>
            <div><b>Score: </b>${user.points}</div>
        </div>`
        $('.leaderboard-users').html(htm)

    })
})
//User left
socket.on('userLeft', ({ userList, leavingUsername }) => {
    let prev = $('.chat-container').html();
    prev += `<div class="text-danger p-1 my-2 border rounded text-center">${leavingUsername} Left the Room</div>`
    $('.chat-container').html(prev);
    document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight

    let htm = '';
    userList.forEach((user, i) => {
        let color = 'white';
        if (i + 1 == 1) color = 'gold';
        else if (i + 1 == 2) color = 'silver'
        else if (i + 1 == 3) color = 'brown'
        htm +=
            `<div class="p-1 my-2 border rounded" style="background-color:${color};">
            <div><i class="fas fa-user mr-3"></i>${user.username}</div>
            <div><b>Score: </b>${user.points}</div>
        </div>`
        $('.leaderboard-users').html(htm)

    })
})

//Initial Start
$('#adminstart').on('click', () => {
    socket.emit('adminStart')
})
socket.on('adminStart', () => {
    $('.startGamePrompt').fadeOut();
    setInterval(() => {
        Time--;
        if (Time < 0) {
            Time = -1
        }
        $('#time').text(Time)
        if (Time === 0) {
            notification(`The Word was:  "${secretWord}"`)
            if (isTurn) {
                socket.emit('timeOut')
            }
        }
    }, 1000)
})

//Getting Words and Drawer Information
//RoundTimer Starts

socket.on('toDrawer', ({ word, userTurn }) => {
    isTurn = true;
    Time = constTime;
    secretWord = word;
    $('#word').text(word);
    notification(`You are Drawing:  "${word}"`)

})
socket.on('toGuesser', ({ word, userTurn }) => {
    isTurn = false;
    secretWord = word;
    hasGuessed = false;
    Time = constTime;
    let hiddenWord = '';
    for (let i = 0; i < word.length; i++) {
        hiddenWord += "_ "
    }
    $('#word').text(hiddenWord);
    notification(`${userTurn.username} is Drawing!`)

});

//Handling Draw Functions
socket.on('propagateDrawing', ({ color, width, x, y }) => {
    draw(color, width, x, y);
})
socket.on('mouseup', () => {
    ctx.beginPath()
})
socket.on('clearScreen', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
});

//Handling Guess Functions
userGuess.addEventListener('keydown', (e) => {
    if (e.code === "Enter") {
        if (!hasGuessed) {
            socket.emit('userGuessesWord', { username, secretWord, guess: e.target.value, Time });
        }
        else {
            let prev = $('.chat-container').html();
            prev += `<div class="text-warning p-1 my-2 border rounded text-center">Youve Already Guessed the Word!</div>`
            $('.chat-container').html(prev);
            document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight

        }
        if (secretWord.toLowerCase() === e.target.value.toLowerCase()) {
            hasGuessed = true;
        }
        e.target.value = ""
    }
})

socket.on('rightGuess', ({ username }) => {
    let prev = $('.chat-container').html();
    prev += `<div class="text-success p-1 my-2 border rounded text-center">${username} Guessed the Word</div>`
    $('.chat-container').html(prev);
    document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight

})
socket.on('wrongGuess', ({ username, guess }) => {
    let prev = $('.chat-container').html();
    prev += `<div class="p-1 my-2 rounded"><b>${username}</b>: ${guess}</div>`
    $('.chat-container').html(prev);
    document.querySelector('.chat-container').scrollTop = document.querySelector('.chat-container').scrollHeight

})

socket.on('updatingPoints', ({ users }) => {
    let userList = users
    let htm = '';
    userList.forEach((user, i) => {
        let color = 'white';
        if (i + 1 == 1) color = 'gold';
        else if (i + 1 == 2) color = 'silver'
        else if (i + 1 == 3) color = 'brown'
        htm +=
            `<div class="p-1 my-2 border rounded" style="background-color:${color};">
            <div><i class="fas fa-user mr-3"></i>${user.username}</div>
            <div><b>Score: </b>${user.points}</div>
        </div>`
        $('.leaderboard-users').html(htm)

    })
})

socket.on('revealWord', () => {
    notification(`The Word Was : ${secretWord}`)
})




