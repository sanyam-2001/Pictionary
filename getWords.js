const words = require('./words.json');
const getRandomWords = (arr) => {
    let choices = [];
    while (choices.length !== 3) {
        let index = Math.floor((Math.random() * arr.length))
        if (choices.includes(arr[index])) continue;
        else choices.push(arr[index]);
    }
    return choices;
}

const getWords = (num) => {
    switch (num) {
        case 3:
            return getRandomWords(words.three)

        case 4:
            return getRandomWords(words.four)

        case 5:
            return getRandomWords(words.five)

        case 6:
            return getRandomWords(words.six)

        case 7:
            return getRandomWords(words.seven)
        case 8:
            return getRandomWords(words.eight)
        case 9:
            return getRandomWords(words.nine)
        case 10:
            return getRandomWords(words.ten)

    }
}

module.exports = getWords