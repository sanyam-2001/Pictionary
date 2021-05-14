//Canvas Init Variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight * 2 / 3;

//Canvas Config Variables
let width = 5;
let color = "#000000";
let isTurn = false;
let isDrawing = false;

//Url Constants
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const room = urlParams.get('room');
const isAdmin = urlParams.get('isAdmin') === 'true' ? true : false
const userGuess = document.getElementById('userGuess')
//Init Socket Vars
const socket = io()
let secretWord = ''
let hasGuessed = false;
//Timer Function
const constTime = 120;
let Time = constTime;


//Utility Functions
function toast() {
    gsap.from('.main-toast', { top: '5%' })
    $('.main-toast').fadeIn(200);
    setTimeout(() => { gsap.to('.main-toast', { top: '15%' }); $('.main-toast').fadeOut(); }, 1000);
}

function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

function notification(text) {
    $('#notification-body').text(text);
    gsap.from('.notification', { top: '5%' });
    $('.notification').fadeIn(200);
    setTimeout(() => { $('.notification').fadeOut(); }, 2000);
}