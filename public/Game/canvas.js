//Canvas Control Functions
canvas.addEventListener('mousedown', () => {
    isDrawing = true;
})
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    if (isTurn) {
        socket.emit('mouseup')
    }
    ctx.beginPath();
})
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && isTurn) {
        const x = Math.floor(e.clientX - canvas.getBoundingClientRect().left), y = Math.floor(e.clientY - canvas.getBoundingClientRect().top)
        socket.emit('propagateDrawing', { color, width, x, y })
        draw(color, width, x, y)

    }
})
$('#color-picker').on('change', (e) => {
    color = e.target.value;
})
$('#width-picker').on('change', (e) => {
    width = e.target.value
})
$('#clear').on('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clearScreen');
})
function draw(color, width, x, y) {
    ctx.lineCap = 'round'
    ctx.strokeStyle = color;
    ctx.lineWidth = width
    ctx.lineTo(x, y)
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y)
}