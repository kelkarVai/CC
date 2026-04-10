document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('#game-board');
    const startButton = document.getElementById('start-game');
    const resultDisplay = document.getElementById('result');
    const timerDisplay = document.getElementById('timer');
    const movesDisplay = document.getElementById('moves');

    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matches = 0;
    let moves = 0;

    let timer = 0;
    let interval;

    const images = [
        'images/f1.jpg',
        'images/f2.webp',
        'images/f3.webp',
        'images/f4.webp',
        'images/f5.jpg'
    ];

    function shuffle(array) {
        return array.sort(() => 0.5 - Math.random());
    }

    function startTimer() {
        clearInterval(interval);
        timer = 0;
        timerDisplay.textContent = `⏱ Time: 0s`;

        interval = setInterval(() => {
            timer++;
            timerDisplay.textContent = `⏱ Time: ${timer}s`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(interval);
    }

    function createBoard() {
        grid.innerHTML = '';
        resultDisplay.textContent = '';
        matches = 0;
        moves = 0;

        movesDisplay.textContent = "🎯 Moves: 0";

        startTimer();

        let cardArray = [...images, ...images];
        cardArray = shuffle(cardArray);

        cardArray.forEach((img) => {

            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = img;

            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <img src="${img}">
                    </div>
                    <div class="card-back"></div>
                </div>
            `;

            card.addEventListener('click', flipCard);
            grid.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flip');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        moves++;
        movesDisplay.textContent = `🎯 Moves: ${moves}`;

        checkMatch();
    }

    function checkMatch() {
        const isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');

            firstCard.removeEventListener('click', flipCard);
            secondCard.removeEventListener('click', flipCard);

            matches++;
            resetTurn();

            // ✅ FIXED WIN CONDITION
            if (matches === images.length) {
                stopTimer();

                resultDisplay.textContent =
                    `🎉 You Won! Time: ${timer}s | Moves: ${moves}`;
            }

        } else {
            setTimeout(() => {
                firstCard.classList.remove('flip');
                secondCard.classList.remove('flip');
                resetTurn();
            }, 800);
        }
    }

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    startButton.addEventListener('click', createBoard);
});
