const board = document.querySelector(".board");
const resetBtn = document.querySelector(".resetBtn");
const levelDisplay = document.querySelector(".levelDisplay");
let cardInfo = [
    { name: "naruto", length: 0 },
    { name: "kakashi", length: 0 },
    { name: "sasuke", length: 0 },
    { name: "shikamaru", length: 0 },
    { name: "itachi", length: 0 },
    { name: "obito", length: 0 },
];

let cards = [];
let pickedCards = [];
let storeMatchedCards = [];
let cardsLength = 2;
let cardSize = 60;

const fillCard = async () => {
    let cardAmouToRem = 0;
    let amountToAdd = 0;

    if (cardsLength - cardInfo.length > 0) {
        amountToAdd = cardsLength - cardInfo.length;
    }
    if (cardInfo.length - cardsLength > 0) {
        cardAmouToRem = cardInfo.length - cardsLength;
    }

    let cardInfoClone = [
        { name: "naruto", length: 0 },
        { name: "kakashi", length: 0 },
        { name: "sasuke", length: 0 },
        { name: "shikamaru", length: 0 },
        { name: "itachi", length: 0 },
        { name: "obito", length: 0 },
    ];

    if (amountToAdd) {
        Array.from({ length: amountToAdd }).forEach((i) => {
            const randomIndex = Math.floor(
                Math.random() * cardInfoClone.length
            );
            const card = cardInfoClone[randomIndex];
            cardInfo = cardInfo.concat(card);
        });
    }

    while (cardInfo.length - cardAmouToRem) {
        const randomIndex = Math.floor(
            Math.random() * (cardInfo.length - cardAmouToRem)
        );

        if (cardInfo[randomIndex].length < cardsLength) {
            cards.push(cardInfo[randomIndex].name);
            cardInfo[randomIndex].length += 1;
        } else {
            cardInfo.splice(randomIndex, 1);
        }
    }

    if (cardsLength > 10) {
        cardSize -= ((cardsLength - 2) / 2) * 5;
    }
    const boxesWidth = Math.round(cards.length / Math.sqrt(cards.length));
    board.style.width = `${boxesWidth * cardSize}px`;
};

const resetBoard = () => {
    document.querySelectorAll(".flipInner").forEach((box, index) => {
        box.classList.remove("showCard");
        box.classList.remove("showCard");
        box.classList.add("correctMatch");
    });

    cardInfo = [
        { name: "naruto", length: 0 },
        { name: "kakashi", length: 0 },
        { name: "sasuke", length: 0 },
        { name: "shikamaru", length: 0 },
        { name: "itachi", length: 0 },
        { name: "obito", length: 0 },
    ];
    pickedCards = [];
    storeMatchedCards = [];
    cards = [];
    fillCard();
    renderCards();
    clearTimeout(timeoutId);
};

const flipCard = (first, dir = "front") => {
    const flipInner = document.querySelectorAll(".flipInner");
    if (dir === "front") {
        flipInner[first].classList.remove("hideCard");
        flipInner[first].classList.add("showCard");
    } else {
        flipInner[first].classList.remove("showCard");
        flipInner[first].classList.add("hideCard");
    }
};

const correctlyMatched = (first, second, act = "add") => {
    if (typeof first !== "number" || typeof second !== "number") {
        return;
    }

    const boxes = document.querySelectorAll(".box");
    if (act === "add") {
        boxes[first].classList.add("correctMatch");
        boxes[second].classList.add("correctMatch");
    } else {
        boxes[first].classList.remove("correctMatch");
        boxes[second].classList.remove("correctMatch");
    }
};

const checkMatched = () => {
    if (storeMatchedCards.length === cards.length) {
        return;
    }
    pickedCards.forEach((index) => {
        flipCard(index);
    });

    if (pickedCards.length > 1) {
        const firstCard = pickedCards[0];
        const secondCard = pickedCards[1];

        if (
            cards[firstCard] === cards[secondCard] &&
            !storeMatchedCards.includes(firstCard) &&
            !storeMatchedCards.includes(secondCard)
        ) {
            storeMatchedCards = storeMatchedCards.concat([
                firstCard,
                secondCard,
            ]);
            correctlyMatched(firstCard, secondCard);
        }

        timeoutId = setTimeout(() => {
            const oldFirstCard = pickedCards[0];
            const oldSecondCard = pickedCards[1];

            if (cards[oldFirstCard] !== cards[oldSecondCard]) {
                flipCard(oldFirstCard, "back");
                flipCard(oldSecondCard, "back");
            }
            pickedCards = pickedCards.filter((card) => {
                return card !== oldFirstCard && card !== oldSecondCard;
            });

            clearTimeout(timeoutId);
        }, 700);
        /*animation wait 0.7s before it plays
          animation takes 1s before it stops plyaing
          0.7 + 1  = 1.7
          wait for 1700 seconds before removing the animation
        */

        matchedId = setTimeout(() => {
            const oldFirstCard = pickedCards[0];
            const oldSecondCard = pickedCards[1];
            if (oldFirstCard === oldSecondCard) {
                correctlyMatched(oldFirstCard, oldSecondCard, "rem");
            }

            if (storeMatchedCards.length >= cards.length) {
                cardsLength += 2;
                storeMatchedCards = [];
                resetBoard();
                levelDisplay.textContent = "Level " + cardsLength / 2;
            }

            // clearTimeout(matchedId);
        }, 1700);
    }
};

const renderCards = () => {
    let html = "";
    cards.forEach((card, index) => {
        const image = `<img src=${
            "./images/" + card + ".jpg"
        } class="cardImg">`;

        html += `<div class="box flipCardSqr">
                   <div class="flipInner hideCard">${image}</div>
                 </div>`;
    });
    board.innerHTML = html;
    document.querySelectorAll(".box").forEach((box, index) => {
        box.style.width = `${cardSize}px`;
        box.style.height = `${cardSize}px`;
        box.addEventListener("click", () => {
            if (
                !pickedCards.includes(index) &&
                !storeMatchedCards.includes(index) &&
                pickedCards.length < 2
            ) {
                pickedCards.push(index);
                checkMatched();
            }
        });
    });
};

resetBtn.addEventListener("click", () => {
    resetBoard();
});

fillCard();
renderCards();
