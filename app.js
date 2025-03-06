/**
 * Main application for Tic Tac Toe
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const cells = document.querySelectorAll('.cell');
    const playerIcon = document.getElementById('player-icon');
    const turnText = document.getElementById('turn-text');
    const resetBtn = document.getElementById('reset-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    const resultModal = document.getElementById('result-modal');
    const resultText = document.getElementById('result-text');
    const xWinsElement = document.getElementById('x-wins');
    const oWinsElement = document.getElementById('o-wins');
    const drawsElement = document.getElementById('draws');
    const pvpBtn = document.getElementById('pvp-btn');
    const aiBtn = document.getElementById('ai-btn');
    const difficultyBtns = document.querySelectorAll('.diff-btn');
    const playerSelectionBtns = document.querySelectorAll('.player-btn');
    const difficultySelection = document.querySelector('.difficulty-selection');
    const playerSelection = document.querySelector('.player-selection');
    
    // Game instances
    const game = new TicTacToe();
    const ai = new TicTacToeAI('medium');
    let playerSymbol = 'x'; // Default player symbol
    
    // Initialize the game
    initGame();
    
    /**
     * Initialize the game
     */
    function initGame() {
        // Add event listeners to cells
        cells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });
        
        // Add event listeners to buttons
        resetBtn.addEventListener('click', resetGame);
        playAgainBtn.addEventListener('click', closeModalAndReset);
        pvpBtn.addEventListener('click', () => setGameMode('pvp'));
        aiBtn.addEventListener('click', () => setGameMode('ai'));
        
        // Add event listeners for difficulty buttons
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                ai.setDifficulty(e.target.dataset.difficulty);
                resetGame();
            });
        });

        // Add event listeners for player selection
        playerSelectionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                playerSelectionBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                playerSymbol = btn.id === 'player1-btn' ? 'x' : 'o';
                resetGame();
            });
        });
        
        // Update stats display
        updateStats();
    }
    
    /**
     * Handle cell click event
     * @param {Event} e - Click event
     */
    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));
        
        // Make move if valid
        if (game.makeMove(index)) {
            // Update UI
            updateBoard();
            
            // Make AI move if in AI mode and it's O's turn
            if (game.gameMode === 'ai' && !game.gameOver && game.currentPlayer === 'o') {
                setTimeout(() => {
                    makeAIMove();
                    updateBoard();
                }, 500);
            }
        }
    }
    
    /**
     * Make AI move
     */
    function makeAIMove() {
        const aiMove = ai.makeMove(game);
        
        if (aiMove !== null) {
            game.makeMove(aiMove);
        }
    }
    
    /**
     * Update the game board UI
     */
    function updateBoard() {
        // Update cells
        cells.forEach((cell, index) => {
            // Remove all classes first
            cell.className = 'cell';
            
            // Add player class if cell is marked
            if (game.board[index] === 'x') {
                cell.classList.add('x');
            } else if (game.board[index] === 'o') {
                cell.classList.add('o');
            }
            
            // Highlight winning cells
            if (game.winningCells.includes(index)) {
                cell.classList.add('win-cell');
            }
        });
        
        // Update turn indicator
        updateTurnIndicator();
        
        // Show result modal if game is over
        if (game.gameOver) {
            showResult();
            updateStats();
        }
    }
    
    /**
     * Update the turn indicator
     */
    function updateTurnIndicator() {
        // Clear previous classes
        playerIcon.innerHTML = '';
        
        if (game.gameOver) {
            // Game over, don't show turn
            return;
        }
        
        // Set icon and text based on current player
        if (game.currentPlayer === 'x') {
            playerIcon.innerHTML = '<i class="fas fa-times"></i>';
            playerIcon.style.backgroundColor = 'var(--x-color)';
            turnText.textContent = game.gameMode === 'ai' ? 'Your Turn' : 'Player X\'s Turn';
        } else {
            playerIcon.innerHTML = '<i class="far fa-circle"></i>';
            playerIcon.style.backgroundColor = 'var(--o-color)';
            turnText.textContent = game.gameMode === 'ai' ? 'AI is thinking...' : 'Player O\'s Turn';
        }
    }
    
    /**
     * Show game result in modal
     */
    function showResult() {
        if (game.winner === 'x') {
            resultText.textContent = game.gameMode === 'ai' ? 'You Win!' : 'Player X Wins!';
            resultText.style.color = 'var(--x-color)';
        } else if (game.winner === 'o') {
            resultText.textContent = game.gameMode === 'ai' ? 'AI Wins!' : 'Player O Wins!';
            resultText.style.color = 'var(--o-color)';
        } else {
            resultText.textContent = 'It\'s a Draw!';
            resultText.style.color = 'var(--primary-color)';
        }
        
        resultModal.classList.add('active');
    }
    
    /**
     * Close result modal and reset game
     */
    function closeModalAndReset() {
        resultModal.classList.remove('active');
        resetGame();
    }
    
    /**
     * Reset the game
     */
    function resetGame() {
        game.resetGame();
        // If AI mode and player is O, make AI start
        if (game.gameMode === 'ai' && playerSymbol === 'o') {
            makeAIMove();
        }
        updateBoard();
    }
    
    /**
     * Update stats display
     */
    function updateStats() {
        xWinsElement.textContent = game.stats.xWins;
        oWinsElement.textContent = game.stats.oWins;
        drawsElement.textContent = game.stats.draws;
    }
    
    /**
     * Set game mode
     * @param {string} mode - 'pvp' or 'ai'
     */
    function setGameMode(mode) {
        game.setGameMode(mode);
        resetGame();
        
        // Show/hide appropriate selections
        if (mode === 'pvp') {
            pvpBtn.classList.add('active');
            aiBtn.classList.remove('active');
            difficultySelection.classList.add('hidden');
            playerSelection.classList.remove('hidden');
        } else {
            aiBtn.classList.add('active');
            pvpBtn.classList.remove('active');
            difficultySelection.classList.remove('hidden');
            playerSelection.classList.add('hidden');
        }
        
        updateTurnIndicator();
    }
});