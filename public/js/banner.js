let letters = $('i'),
    flickers = [5, 7, 9, 11, 13, 15, 17],
    flickingLetters = [2, 9], //which letters to flicker
    randomLetter,
    flickerNumber,
    counter;

function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function randomFromArray(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function flicker() {
    counter += 1;

    if (counter === flickerNumber) {
        return;
    }

    setTimeout(() => {
        if (hasClass(randomLetter, 'off')) {
            randomLetter.className = '';
        } else {
            randomLetter.className = 'off';
        }

        flicker();
    }, 30);
}

(function loop() {
    let rand = randomFromInterval(500, 3000);

    randomLetter = randomFromArray(flickingLetters);
    randomLetter = letters[randomLetter];

    flickerNumber = randomFromInterval(0, 12);
    flickerNumber = flickers[flickerNumber];

    setTimeout(function () {
        counter = 0;
        flicker();
        loop();
    }, rand);
}());