/**
 * AI player using Minimax algorithm
 */
class TicTacToeAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty; // 'easy', 'medium', 'hard'
    }
    
    /**
     * Make a move based on the current game state
     * @param {TicTacToe} game - The current game instance
     * @returns {number} - The chosen move index
     */
    makeMove(game) {
        const validMoves = game.getValidMoves();
        
        if (validMoves.length === 0) return null;

        switch (this.difficulty) {
            case 'easy':
                return this.getRandomMove(validMoves);
            case 'medium':
                return Math.random() < 0.7 ? this.getSmartMove(game) : this.getRandomMove(validMoves);
            case 'hard':
                return this.getBestMove(game);
            default:
                return this.getBestMove(game);
        }
    }
    
    /**
     * Get a random move from valid moves
     * @param {number[]} validMoves - Array of valid move indexes
     * @returns {number} - A random move index
     */
    getRandomMove(validMoves) {
        const randomIndex = Math.floor(Math.random() * validMoves.length);
        return validMoves[randomIndex];
    }
    
    /**
     * Get the best move using the minimax algorithm
     * @param {TicTacToe} game - The current game instance
     * @returns {number} - The best move index
     */
    getBestMove(game) {
        // Create a deep copy of the game to avoid modifying the original
        const gameCopy = this.cloneGame(game);
        const aiPlayer = gameCopy.currentPlayer;
        
        let bestScore = -Infinity;
        let bestMove = null;
        
        // Try each valid move and find the best one
        for (const move of gameCopy.getValidMoves()) {
            const boardCopy = [...gameCopy.board];
            
            // Make a move
            boardCopy[move] = aiPlayer;
            
            // Get score for this move
            const score = this.minimax(boardCopy, 0, false, aiPlayer, aiPlayer === 'x' ? 'o' : 'x');
            
            // Update best score and move if better
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    /**
     * Minimax algorithm to find the best move
     * @param {string[]} board - The current board state
     * @param {number} depth - Current depth in the tree
     * @param {boolean} isMaximizing - Whether to maximize or minimize
     * @param {string} aiPlayer - The AI player ('x' or 'o')
     * @param {string} currentPlayer - Current player ('x' or 'o')
     * @returns {number} - The score for this move
     */
    minimax(board, depth, isMaximizing, aiPlayer, currentPlayer) {
        // Check if the game is over
        const result = this.checkWinner(board);
        
        // Terminal states
        if (result !== null) {
            if (result === aiPlayer) return 10 - depth; // AI wins
            if (result === 'draw') return 0;           // Draw
            return depth - 10;                         // Opponent wins
        }
        
        // Get valid moves
        const validMoves = board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
        
        // Maximizing player (AI)
        if (isMaximizing) {
            let bestScore = -Infinity;
            
            for (const move of validMoves) {
                const boardCopy = [...board];
                boardCopy[move] = currentPlayer;
                
                const score = this.minimax(
                    boardCopy, 
                    depth + 1, 
                    false, 
                    aiPlayer, 
                    currentPlayer === 'x' ? 'o' : 'x'
                );
                
                bestScore = Math.max(score, bestScore);
            }
            
            return bestScore;
        } 
        // Minimizing player (opponent)
        else {
            let bestScore = Infinity;
            
            for (const move of validMoves) {
                const boardCopy = [...board];
                boardCopy[move] = currentPlayer;
                
                const score = this.minimax(
                    boardCopy, 
                    depth + 1, 
                    true, 
                    aiPlayer, 
                    currentPlayer === 'x' ? 'o' : 'x'
                );
                
                bestScore = Math.min(score, bestScore);
            }
            
            return bestScore;
        }
    }
    
    /**
     * Check if there's a winner or draw
     * @param {string[]} board - The current board state
     * @returns {string|null} - 'x', 'o', 'draw', or null
     */
    checkWinner(board) {
        // Winning combinations
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        // Check for win
        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        // Check for draw
        if (!board.includes('')) {
            return 'draw';
        }
        
        // Game still ongoing
        return null;
    }
    
    /**
     * Create a deep copy of a game instance
     * @param {TicTacToe} game - The game to clone
     * @returns {TicTacToe} - A clone of the game
     */
    cloneGame(game) {
        const clone = new TicTacToe();
        clone.board = [...game.board];
        clone.currentPlayer = game.currentPlayer;
        clone.gameOver = game.gameOver;
        clone.winner = game.winner;
        clone.winningCells = [...game.winningCells];
        clone.gameMode = game.gameMode;
        
        return clone;
    }
    
    /**
     * Set AI difficulty
     * @param {string} difficulty - 'easy', 'medium', or 'hard'
     */
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
    }

    /**
     * Get a smart move based on improved strategies
     * @param {TicTacToe} game - The current game instance
     * @returns {number} - The chosen move index
     */
    getSmartMove(game) {
        // Try to win
        const winningMove = this.findWinningMove(game.board, game.currentPlayer);
        if (winningMove !== null) return winningMove;

        // Block opponent's winning move
        const blockingMove = this.findWinningMove(game.board, game.currentPlayer === 'x' ? 'o' : 'x');
        if (blockingMove !== null) return blockingMove;

        // Take center if available
        if (game.board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8].filter(i => game.board[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // Take any available move
        return this.getRandomMove(game.getValidMoves());
    }

    /**
     * Find a winning move for the given player
     * @param {string[]} board - The current board state
     * @param {string} player - The player to check for ('x' or 'o')
     * @returns {number|null} - The winning move index or null if no winning move
     */
    findWinningMove(board, player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const counts = pattern.reduce((acc, pos) => {
                if (board[pos] === player) acc.player++;
                if (board[pos] === '') acc.empty = pos;
                return acc;
            }, { player: 0, empty: null });

            if (counts.player === 2 && counts.empty !== null) {
                return counts.empty;
            }
        }

        return null;
    }
}