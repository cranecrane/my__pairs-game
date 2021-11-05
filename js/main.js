(() => {
    function shuffle(arr) {
        const result = [];

        while (arr.length) {
            let elem = arr.splice(getRandomNum(0, arr.length - 1), 1)[0];
            result.push(elem);
        }

        return result;
    }

    function getRandomNum(num1, num2) {
        const range = Math.abs(num1 - num2);
        const min = Math.min(num1, num2);

        return Math.round(Math.random() * range) + min;
    }

    function createCardsValues(rows) {
        const cardsCount = (rows * rows) / 2;
        const values = [];

        for (let i = 1; i <= cardsCount; i++) {
            for (let j = 2; j > 0; j--) {
                values.push(i);
            }
        }
        return values;
    }

    function createCard(value, styles) {
        const card = document.createElement('button');

        card.setAttribute('type', 'button');
        card.setAttribute('aria-label', 'Перевернуть карту');
        card.textContent = value;
        for (const elem of styles) {
            card.classList.add(elem);
        }
        return card;
    }

    function cleanGameField(container) {
        const field = document.querySelectorAll('.card');
        container.classList.remove(`--rows-${Math.sqrt(field.length)}`);
        field.forEach( elem => {
            elem.remove();
        });
    }

    function showStartWindow() {
        document.querySelector('.modal--start').classList.remove('hidden');
        document.body.classList.add('disable-scroll');
    }

    function showEndWindow() {
        document.querySelector('.modal--end').classList.remove('hidden');
        document.body.classList.add('disable-scroll');
    }

    function createGameField(rows, values, styles, container, timer, timerCounter) {
        const cards = [];
        const openedCards = [];
        let counter = -1;

        cleanGameField(container);

        container.classList.add(`--rows-${rows}`);
        for (const value of values) {
            cards.push(createCard(value, styles));
        }
        for (const card of cards) {
            container.append(card);
        }

        cards.forEach((elem) => {
            elem.addEventListener('click', () => {
                elem.classList.add('open');
                elem.setAttribute('disabled', 'true');
               
                if ( openedCards.length > 1 && (openedCards.length % 2 === 0) ) {
                    if (openedCards[counter].textContent !== openedCards[counter - 1].textContent) {
                        let card1 = cards.indexOf(openedCards[counter]);
                        let card2 = cards.indexOf(openedCards[counter - 1]);

                        cards[card1].classList.remove('open');
                        cards[card1].removeAttribute('disabled');
                        cards[card2].classList.remove('open');
                        cards[card2].removeAttribute('disabled');
                        counter -= 2;
                        openedCards.splice(-2);
                    }
                }
                openedCards.push(elem);
                counter++;
                if (openedCards.length === values.length) {
                    showEndWindow();
                    cleanGameField(container);

                    clearInterval(timer);
                    document.querySelector('.control__btn-icon--timer').classList.remove('hidden');
                    timerCounter.classList.remove('active');
                    timerFlag = 0;
                } 
            });
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        const container = document.querySelector('.cards');
        const cardStyles = ['cards__item', 'card', 'btn-reset'];
        const cardsValues = (rows) => {
            return shuffle(createCardsValues(rows));
        };
        const rows = () => {
            const value = parseInt(document.getElementById('rows').value);
            if (value >= 2 && value <= 10 && (value % 2 === 0)) {
                return value;
            }
            return 4;
        };
        const startBtn = document.querySelector('.start-game');
        const restartBtn = document.querySelector('.restart-game');
        const newGameBtn = document.querySelector('.new-game');
        const form = document.querySelector('form');
        const timer = document.getElementById('timer');
        const counter = document.querySelector('.control__counter');
        let timerFlag = 0;

        startBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
            document.body.classList.remove('disable-scroll');
            createGameField(rows(), cardsValues(rows()), cardStyles, container, timerFlag, counter);
        });
        restartBtn.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
            showStartWindow();
        });
        newGameBtn.addEventListener('click', function() {
            showStartWindow();
            clearInterval(timerFlag);
            document.querySelector('.control__btn-icon--timer').classList.remove('hidden');
            counter.classList.remove('active');
            timerFlag = 0;
        });
        form.addEventListener('submit', e => {
            e.preventDefault();
        })
        timer.addEventListener('click', () => {
            let num = 60;

            if (!timerFlag) {
                document.querySelector('.control__btn-icon--timer').classList.add('hidden');
                counter.classList.add('active');
                counter.textContent = num--;
                const timerID = setInterval(() => {
                    counter.textContent = num--;
                    timerFlag = timerID;
                    if (num < 0) {
                        clearInterval(timerID);
                        document.querySelector('.control__btn-icon--timer').classList.remove('hidden');
                        counter.classList.remove('active');
                        timerFlag = 0;
                        cleanGameField(container);
                        showEndWindow();
                    }
                }, 1000);
            }
        }); 
    })
})();
