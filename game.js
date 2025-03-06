/**
 * Game class to handle Tic Tac Toe logic
 */
class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameOver = false;
        this.winner = null;
        this.winningCells = [];
        this.gameMode = 'pvp'; // 'pvp' or 'ai'
        this.stats = {
            xWins: 0,
            oWins: 0,
            draws: 0
        };
        
        // Load stats from local storage if available
        this.loadStats();
    }
    
    /**
     * Make a move on the board
     * @param {number} index - The cell index (0-8)
     * @returns {boolean} - Whether the move was valid
     */
    makeMove(index) {
        // Check if the move is valid
        if (this.gameOver || this.board[index] !== '') {
            return false;
        }
        
        // Make the move
        this.board[index] = this.currentPlayer;
        
        // Check for win or draw
        this.checkGameState();
        
        // Switch players if game not over
        if (!this.gameOver) {
            this.switchPlayer();
        }
        
        return true;
    }
    
    /**
     * Switch the current player
     */
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'x' ? 'o' : 'x';
    }
    
    /**
     * Check the game state for win or draw
     */
    checkGameState() {
        // Winning combinations (indexes)
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        // Check for win
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.gameOver = true;
                this.winner = this.currentPlayer;
                this.winningCells = pattern;
                
                // Update stats
                if (this.winner === 'x') {
                    this.stats.xWins++;
                } else {
                    this.stats.oWins++;
                }
                this.saveStats();
                return;
            }
        }
        
        // Check for draw
        if (!this.board.includes('')) {
            this.gameOver = true;
            this.winner = null; // Draw
            this.stats.draws++;
            this.saveStats();
        }
    }
    
    /**
     * Reset the game board
     */
    resetGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'x';
        this.gameOver = false;
        this.winner = null;
        this.winningCells = [];
    }
    
    /**
     * Get valid moves (empty cells)
     * @returns {number[]} - Array of valid move indexes
     */
    getValidMoves() {
        return this.board
            .map((cell, index) => cell === '' ? index : null)
            .filter(index => index !== null);
    }
    
    /**
     * Save game stats to local storage
     */
    saveStats() {
        localStorage.setItem('ticTacToeStats', JSON.stringify(this.stats));
    }
    
    /**
     * Load game stats from local storage
     */
    loadStats() {
        const savedStats = localStorage.getItem('ticTacToeStats');
        if (savedStats) {
            this.stats = JSON.parse(savedStats);
        }
    }
    
    /**
     * Set game mode
     * @param {string} mode - 'pvp' or 'ai'
     */
    setGameMode(mode) {
        this.gameMode = mode;
    }
}