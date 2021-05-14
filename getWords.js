const words = require('./words.json');
const randomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const getWordArr = () => {
    const len = randomNumber(3, 10);
    switch (len) {
        case 3:
            return words.three
        case 4:
            return words.four
        case 5:
            return words.five
        case 6:
            return words.six
        case 7:
            return words.seven
        case 8:
            return words.eight
        case 9:
            return words.nine
        case 10:
            return words.ten
    }
}

const getWords = () => {
    const arr = getWordArr();
    const index = randomNumber(0, arr.length - 1);
    return arr[index];
}


module.exports = getWords