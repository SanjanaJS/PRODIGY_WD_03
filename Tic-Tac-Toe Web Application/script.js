// ============================================
// XO ARENA — TIC-TAC-TOE
// ============================================


// --------------------------------------------
// ELEMENTS
// --------------------------------------------

const cells = document.querySelectorAll(".cell");

const playerModeBtn = document.getElementById("playerModeBtn");
const aiModeBtn = document.getElementById("aiModeBtn");

const restartBtn = document.getElementById("restartBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const scoreXDisplay = document.getElementById("scoreX");
const scoreODisplay = document.getElementById("scoreO");
const scoreDrawDisplay = document.getElementById("scoreDraw");

const turnIcon = document.getElementById("turnIcon");
const turnText = document.getElementById("turnText");

const resultMessage = document.getElementById("resultMessage");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");

const statusText = document.getElementById("statusText");


// --------------------------------------------
// GAME VARIABLES
// --------------------------------------------

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "two-player";

let scores = {
    X: 0,
    O: 0,
    draw: 0
};


// --------------------------------------------
// WINNING COMBINATIONS
// --------------------------------------------

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// --------------------------------------------
// HANDLE CELL CLICK
// --------------------------------------------

function handleCellClick(event) {

    const index =
        Number(event.currentTarget.dataset.index);


    // Don't allow clicking an occupied cell
    if (board[index] !== "") {
        return;
    }


    // Don't allow moves after game ends
    if (!gameActive) {
        return;
    }


    // AI mode only allows human to play X
    if (
        gameMode === "ai" &&
        currentPlayer !== "X"
    ) {
        return;
    }


    makeMove(index, currentPlayer);


    // AI makes its move
    if (
        gameMode === "ai" &&
        gameActive &&
        currentPlayer === "O"
    ) {

        statusText.textContent = "AI Thinking...";

        setTimeout(() => {

            makeAIMove();

        }, 500);

    }

}


// --------------------------------------------
// MAKE MOVE
// --------------------------------------------

function makeMove(index, player) {

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );


    const result =
        checkWinner();


    // Player won
    if (result.winner) {

        endGame(
            result.winner,
            result.combo
        );

        return;
    }


    // Draw
    if (board.every(cell => cell !== "")) {

        endGame("draw");

        return;
    }


    // Change player
    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";


    updateTurn();

}


// --------------------------------------------
// CHECK WINNER
// --------------------------------------------

function checkWinner() {

    for (
        const combination
        of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                combo: combination
            };

        }

    }


    return {
        winner: null,
        combo: []
    };

}


// --------------------------------------------
// END GAME
// --------------------------------------------

function endGame(winner, combo = []) {

    gameActive = false;


    // Winner
    if (winner === "X" || winner === "O") {

        scores[winner]++;


        // Highlight winning cells
        combo.forEach(index => {

            cells[index].classList.add(
                "winner"
            );

        });


        scoreXDisplay.textContent =
            scores.X;

        scoreODisplay.textContent =
            scores.O;


        resultTitle.textContent =
            winner === "X"
                ? "Player X Wins!"
                : gameMode === "ai"
                    ? "AI Wins!"
                    : "Player O Wins!";


        resultText.textContent =
            winner === "X"
                ? "Excellent move! Three in a row."
                : gameMode === "ai"
                    ? "The AI completed three in a row."
                    : "Player O completed three in a row.";


        statusText.textContent =
            "Game Over";


        showResult();

        return;
    }


    // Draw
    scores.draw++;


    scoreDrawDisplay.textContent =
        scores.draw;


    resultTitle.textContent =
        "It's a Draw!";


    resultText.textContent =
        "No more moves available. Try again!";


    statusText.textContent =
        "Round Draw";


    showResult();

}


// --------------------------------------------
// SHOW RESULT
// --------------------------------------------

function showResult() {

    resultMessage.classList.add("show");

}


// --------------------------------------------
// UPDATE TURN
// --------------------------------------------

function updateTurn() {

    turnIcon.textContent =
        currentPlayer;


    if (currentPlayer === "X") {

        turnIcon.style.color =
            "var(--x-color)";

        turnIcon.style.background =
            "rgba(84, 168, 255, 0.12)";

        turnText.textContent =
            "Player X's Turn";

    } else {

        turnIcon.style.color =
            "var(--o-color)";

        turnIcon.style.background =
            "rgba(255, 107, 157, 0.12)";


        if (gameMode === "ai") {

            turnText.textContent =
                "AI's Turn";

        } else {

            turnText.textContent =
                "Player O's Turn";

        }

    }

}


// --------------------------------------------
// AI MOVE
// --------------------------------------------

function makeAIMove() {

    if (!gameActive) {
        return;
    }


    const availableMoves =
        board
            .map(
                (cell, index) =>
                    cell === ""
                        ? index
                        : null
            )
            .filter(
                index => index !== null
            );


    if (availableMoves.length === 0) {
        return;
    }


    // First try to win
    let move =
        findBestMove("O");


    // If AI cannot win,
    // try to block player X
    if (move === null) {

        move =
            findBestMove("X");

    }


    // Take center
    if (
        move === null &&
        board[4] === ""
    ) {

        move = 4;

    }


    // Take a corner
    if (move === null) {

        const corners =
            [0, 2, 6, 8]
                .filter(
                    index =>
                        board[index] === ""
                );


        if (corners.length > 0) {

            move =
                corners[
                    Math.floor(
                        Math.random()
                        * corners.length
                    )
                ];

        }

    }


    // Choose any remaining position
    if (move === null) {

        move =
            availableMoves[
                Math.floor(
                    Math.random()
                    * availableMoves.length
                )
            ];

    }


    makeMove(move, "O");

}


// --------------------------------------------
// FIND WINNING MOVE
// --------------------------------------------

function findBestMove(player) {

    for (
        const combination
        of winningCombinations
    ) {

        const [a, b, c] =
            combination;


        const values = [
            board[a],
            board[b],
            board[c]
        ];


        const playerCount =
            values.filter(
                value =>
                    value === player
            ).length;


        const emptyCount =
            values.filter(
                value =>
                    value === ""
            ).length;


        if (
            playerCount === 2 &&
            emptyCount === 1
        ) {

            if (board[a] === "") {
                return a;
            }

            if (board[b] === "") {
                return b;
            }

            if (board[c] === "") {
                return c;
            }

        }

    }


    return null;

}


// --------------------------------------------
// START NEW ROUND
// --------------------------------------------

function restartGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    resultMessage.classList.remove(
        "show"
    );


    statusText.textContent =
        "Game Ready";


    updateTurn();

}


// --------------------------------------------
// RESET SCORE
// --------------------------------------------

function resetScore() {

    scores = {
        X: 0,
        O: 0,
        draw: 0
    };


    scoreXDisplay.textContent = "0";

    scoreODisplay.textContent = "0";

    scoreDrawDisplay.textContent = "0";


    restartGame();


    statusText.textContent =
        "Score Reset";

}


// --------------------------------------------
// TWO PLAYER MODE
// --------------------------------------------

function setTwoPlayerMode() {

    gameMode = "two-player";


    playerModeBtn.classList.add(
        "active"
    );

    aiModeBtn.classList.remove(
        "active"
    );


    restartGame();


    statusText.textContent =
        "2 Player Mode";

}


// --------------------------------------------
// AI MODE
// --------------------------------------------

function setAIMode() {

    gameMode = "ai";


    aiModeBtn.classList.add(
        "active"
    );

    playerModeBtn.classList.remove(
        "active"
    );


    restartGame();


    statusText.textContent =
        "AI Mode";

}


// --------------------------------------------
// BUTTON EVENTS
// --------------------------------------------

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


playerModeBtn.addEventListener(
    "click",
    setTwoPlayerMode
);


aiModeBtn.addEventListener(
    "click",
    setAIMode
);


restartBtn.addEventListener(
    "click",
    restartGame
);


resetScoreBtn.addEventListener(
    "click",
    resetScore
);


// --------------------------------------------
// INITIAL STATE
// --------------------------------------------

updateTurn();
