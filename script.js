console.log("Game loaded");

const cardImages = [
    "assets/bobrossparrot.gif",
    "assets/explodyparrot.gif",
    "assets/fiestaparrot.gif",
    "assets/metalparrot.gif",
    "assets/revertitparrot.gif",
    "assets/tripletsparrot.gif",
    "assets/unicornparrot.gif"
];

let firstCard = null;
let secondCard = null;
let hasFlippedCard = false;
let lockBoard = false;
let matchedCards = [];
let totalFlips = 0; 
let totalGamesWon = 0; 
let overallFlips = 0; 

// Função para perguntar ao usuário quantas cartas quer jogar
function askForNumberOfCards() {
    let numberOfCards;

    while (true) {
        numberOfCards = prompt("Com quantas cartas você quer jogar? Escolha um número par entre 4 e 14.");
        if (numberOfCards !== null) {
            numberOfCards = parseInt(numberOfCards);
            if (numberOfCards >= 4 && numberOfCards <= 14 && numberOfCards % 2 === 0) {
                break;
            }
        }
        alert("Por favor, insira um número par entre 4 e 14.");
    }

    return numberOfCards;
}

// Função para embaralhar as cartas
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Função para configurar o jogo
function setupGame(numberOfCards) {
    const cardGrid = document.querySelector(".card-grid");
    cardGrid.innerHTML = '';

    let selectedImages = cardImages.slice(0, numberOfCards / 2);
    selectedImages = [...selectedImages, ...selectedImages];
    selectedImages = shuffle(selectedImages);

    for (let i = 0; i < numberOfCards; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.cardImage = selectedImages[i];
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front"><img src="assets/back.png" alt="Parrot Closed"></div>
                <div class="card-back"><img src="${selectedImages[i]}" alt="Parrot Open"></div>
            </div>`;

        card.addEventListener("click", () => flipCard(card));
        cardGrid.appendChild(card);
    }
}

// Função para virar a carta
function flipCard(card) {
    if (lockBoard) return;
    if (card === firstCard || matchedCards.includes(card)) return;

    card.classList.toggle("flip");
    totalFlips++;

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

// Função para verificar se as cartas viradas são um par
function checkForMatch() {
    lockBoard = true;

    const isMatch = firstCard.dataset.cardImage === secondCard.dataset.cardImage;

    if (isMatch) {
        matchedCards.push(firstCard, secondCard);
        resetBoard();

        if (matchedCards.length === document.querySelectorAll(".card").length) {
            totalGamesWon++;
            overallFlips += totalFlips;
            setTimeout(() => {
                alert(`Você ganhou em ${totalFlips} jogadas!`);
                showRestartOptions(); 
            }, 500);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetBoard();
        }, 1000);
    }
}

// Função para resetar o estado do jogo
function resetBoard() {
    [firstCard, secondCard, hasFlippedCard] = [null, null, false];
    lockBoard = false;
}

// Função para esconder elementos de boas-vindas
function hideWelcomeElements() {
    document.querySelector(".welcome-text").style.display = "none";
    document.querySelector(".name-label").style.display = "none";
    document.getElementById("player-name").style.display = "none";
    document.getElementById("start-button").style.display = "none";
}

// Função para mostrar opções de reinício
function showRestartOptions() {
    const resultCard = document.querySelector(".result-card");
    resultCard.innerHTML = `
        <p>Você ganhou em ${totalFlips} jogadas!</p>
        <p>Partidas ganhas: ${totalGamesWon}</p>
        <p>Movimentos totais: ${overallFlips}</p>
    `;

    const restartButton = document.createElement("button");
    restartButton.textContent = "Recomeçar o Jogo";
    restartButton.id = "restart-button";
    resultCard.appendChild(restartButton);

    restartButton.addEventListener("click", () => {
        restartGame();
        restartButton.remove(); 
    });

    resultCard.style.display = "block"; 
}

// Função para reiniciar o jogo
function restartGame() {
    totalFlips = 0;
    matchedCards = [];
    firstCard = null;
    secondCard = null;
    hasFlippedCard = false;
    lockBoard = false;

    const cardGrid = document.querySelector(".card-grid");
    cardGrid.innerHTML = '';

    hideWelcomeElements();

    const resultCard = document.querySelector(".result-card");
    if (resultCard) {
        resultCard.style.display = "none"; 
    }
    
    const numberOfCards = askForNumberOfCards();
    setupGame(numberOfCards); 
}

// Inicia o jogo quando o botão "Jogar" é clicado
document.getElementById("start-button").addEventListener("click", function() {
    const playerName = document.getElementById("player-name").value;
    if (!playerName) {
        alert("Por favor, insira seu nome antes de começar!");
        return;
    }
    alert(`Bem-vindo(a), ${playerName}!`);
    hideWelcomeElements();
    const numberOfCards = askForNumberOfCards();
    console.log(`O jogo será iniciado com ${numberOfCards} cartas.`);
    setupGame(numberOfCards);
});
