const canvas = document.getElementById('mainCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 4 / 7;
canvas.height = window.innerHeight * 2 / 3;
let mouseDown = false;
let canDraw = false;
let color = '#000000';
let lineWidth = 5;
let Timer = 120;
canvas.addEventListener('mousedown', () => {
    mouseDown = true;
})

canvas.addEventListener('mousemove', (e) => {
    if (!mouseDown || !canDraw) return;
    draw(e)
})
//Draw Function

//Clear

$('#thickness').on('change', (e) => {
    lineWidth = e.currentTarget.value
})
$('#color').on('change', (e) => {
    color = e.currentTarget.value
})