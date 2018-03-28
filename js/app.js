/*
 *  LIST OF CARDS
 */

const listOfCards = [
    "fa fa-diamond",
    "fa fa-paper-plane-o",
    "fa fa-bomb",
    "fa fa-bolt",
    "fa fa-bicycle",
    "fa fa-anchor",
    "fa fa-bolt",
    "fa fa-cube",
    "fa fa-anchor",
    "fa fa-cube",
    "fa fa-bicycle",
    "fa fa-diamond",
    "fa fa-bomb",
    "fa fa-leaf",
    "fa fa-leaf",
    "fa fa-paper-plane-o"
];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const cards = document.querySelectorAll('.deck li');
const deckOfCards = document.querySelector('.deck');
const starsPanel = document.querySelector('.stars');
let stars = starsPanel.querySelectorAll('li');
const restartButton = document.querySelector('.restart');
const moveCounterDisplay = document.querySelector('.moves');
let startTime = null;
let endTime;
let timerInterval;
let timerCounter = 0;
let timerMin = 0;
let openCards = [];
let matchList = [];
let counterOfMoves = 0;

randomSymbolsInCards(cards);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// SHUFFLE CARDS

function randomSymbolsInCards(array) {
    let shuffleListOfCards = shuffle(listOfCards);
    for (let i = 0; i < array.length; i++) {
        array[i].firstElementChild.className = shuffleListOfCards[i];
    }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// SHUTS TIME
function addTimeToTimer(number) {
    if (number < 10) {
        return '0' + number;
    } else {
        return number;
    }
}

// SHUTS TIME
function startTimer() {
    timerCounter++;
    sec = timerCounter;
    if (timerCounter === 60) {
        timerMin++;
        sec = 0;
        timerCounter = 0;
    }
    document.querySelector('.timer').innerHTML = addTimeToTimer(timerMin) + ':' + addTimeToTimer(sec);
}


deckOfCards.addEventListener("click", function (e) {

    if (!(e.target.className === 'deck') && (openCards.length <= 1) && !(e.target.isClicked === 1) && !(e.target.localName === 'i')) {
        showSymbol(e);
        addCardToOpenCards(e);
        incrementCounter();

        if (counterOfMoves === 1) {
            timerInterval = setInterval(function () {
                startTimer();
            }, 1000);
        }
        timeOfGame();
        removeStarFromScorePanel();
    }
});

// SHOWS CARD
function showSymbol(e) {
    e.target.className = 'card open show';
    e.target.isClicked = 1;
}

function addCardToOpenCards(evt) {
    openCards.push(evt.target.firstElementChild);
    checkTwoCardsMatch(openCards);
    checkTwoCardsNoMatch(openCards);
}
// CHECKS IF IS MATCH
function checkTwoCardsMatch(array) {
    if (array.length === 2 && array[0].className === array[1].className) {
        array[0].parentNode.className = 'card match show';
        array[1].parentNode.className = 'card match show';
        matchList.push(array[0]);
        clearTheOpenCards(array);
    }
}
// IF NOT THIS HAPPENED
function checkTwoCardsNoMatch(array) {
    if (array.length === 2 && array[0].className !== array[1].className) {
        setTimeout(function () {
            array[0].parentNode.className = 'card close';
            array[1].parentNode.className = 'card close';
            array[0].parentNode.isClicked = 0;
            array[1].parentNode.isClicked = 0;
            clearTheOpenCards(array);
        }, 800);
    }
}

function clearTheOpenCards(array) {
    for (let i = 0; i < 2; i++) {
        array.shift();
    }
    return array;
}

// FUNCTION COUNT NUMBER OF MOVEMENTS
function incrementCounter() {
    counterOfMoves++;
    moveCounterDisplay.innerHTML = counterOfMoves;
}

function timeOfGame() {

    // GAME START

    if (counterOfMoves === 1) {
        startTime = Date.now();
    }

    // GAME END

    if (matchList.length === 8) {
        endTime = Date.now() - startTime;
        openEndScreen();
        stopTime();
    }
    return endTime;
}

// FUNCTION THAT OPEN SCREEN AFTER GAME END
function openEndScreen() {
    document.getElementById("endScreen").style.display = "block";
    document.querySelector('#total-time').innerHTML = (Math.round(endTime / 1000, 2) + ' sec');
    document.querySelector("#moves").innerHTML = counterOfMoves;
    if (counterOfMoves < 26) {
        document.querySelector('#score-panel').innerHTML =
            `<li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>`;
    } else if (counterOfMoves < 52) {
        document.querySelector('#score-panel').innerHTML =
            `<li><i class="fa fa-star"></i></li>
            <li><i class="fa fa-star"></i></li>`;
    } else {
        document.querySelector('#score-panel').innerHTML =
            `<li><i class="fa fa-star"></i></li>`
    }
}

function removeStarFromScorePanel() {
    if (counterOfMoves === 26) {
        starsPanel.lastElementChild.style.visibility = 'hidden';
    } else if (counterOfMoves === 52) {
        starsPanel.lastElementChild.previousElementSibling.style.visibility = 'hidden';
    }
}
// FUNCTION THAT RESET GAME TO START POSITION
function resetGame() {
    for (let card of cards) {
        card.className = "card close";
        card.isClicked = 0;
    }
    for (star of stars) {
        star.style.visibility = 'visible';
    }
    stopTime();
    counterOfMoves = 0;
    moveCounterDisplay.innerHTML = counterOfMoves;
    matchList = [];
    openCards = [];
    randomSymbolsInCards(cards);
    document.getElementById("endScreen").style.display = "none";
}

function stopTime() {
    clearInterval(timerInterval);
    timerCounter = 0;
    timerMin = 0;
    document.querySelector('.timer').innerHTML = '00:00';
}


restartButton.addEventListener('click', function () {
    resetGame();
});