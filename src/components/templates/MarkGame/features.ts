export enum Player {
    Black = '⚫️',
    White = '⚪️'
}

export interface GameState {
    boardWidth: number;
    boardData: string[][]; // 二次元配列
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}

export const markGameTitle = () => {
    return 'リバーシゲーム';
}

export function isCellEmpty(gameState: GameState, row: number, col: number) {
    return gameState.boardData[row][col] === '';
}

// 二次元配列へ
export function convertMarkGameCols(boardWidth: number, boardData: string[][]): string[][] {
    return boardData;
}

export function getWinner(gameState: GameState): Player | null {
    const boardData = gameState.boardData;
    let blackCount = 0;
    let whiteCount = 0;

    boardData.forEach(row => {
        row.forEach(cell => {
            if (cell === Player.Black) blackCount++;
            if (cell === Player.White) whiteCount++;
        });
    });

    if (blackCount > whiteCount) return Player.Black;
    if (whiteCount > blackCount) return Player.White;
    return null; // 引き分けの場合
}

export const flipDiscs = (boardData: string[][], row: number, col: number, currentPlayer: Player, boardWidth: number): string[][] => {
    const directions = [
        [-1, 0], [1, 0], // 上下
        [0, -1], [0, 1], // 左右
        [-1, -1], [-1, 1], // 左上、右上
        [1, -1], [1, 1] // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const newBoardData = boardData.map(row => [...row]);

    directions.forEach(([dRow, dCol]) => {
        let r = row + dRow;
        let c = col + dCol;
        const discsToFlip = [];

        while (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === opponent) {
            discsToFlip.push([r, c]);
            r += dRow;
            c += dCol;
        }

        if (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === currentPlayer) {
            discsToFlip.forEach(([flipRow, flipCol]) => {
                newBoardData[flipRow][flipCol] = currentPlayer;
            });
        }
    });

    return newBoardData;
};

export const getValidMoves = (boardData: string[][], currentPlayer: Player, boardWidth: number): [number, number][] => {
    const directions = [
        [-1, 0], [1, 0], // 上下
        [0, -1], [0, 1], // 左右
        [-1, -1], [-1, 1], // 左上、右上
        [1, -1], [1, 1] // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const validMoves: [number, number][] = [];

    boardData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== '') return;

            let isValid = false;
            directions.forEach(([dRow, dCol]) => {
                let r = rowIndex + dRow;
                let c = colIndex + dCol;
                let hasOpponentDisc = false;

                while (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === opponent) {
                    hasOpponentDisc = true;
                    r += dRow;
                    c += dCol;
                }

                if (hasOpponentDisc && r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === currentPlayer) {
                    isValid = true;
                }
            });

            if (isValid) {
                validMoves.push([rowIndex, colIndex]);
            }
        });
    });

    return validMoves;
};

export const initialState: GameState = {
    boardWidth: 8,
    boardData: [
        ["", "", "", "", "", "", "", ""], // 1行目
        ["", "", "", "", "", "", "", ""], // 2行目
        ["", "", "", "", "", "", "", ""], // 3行目
        ["", "", "", "⚫️", "⚪️", "", "", ""], // 4行目
        ["", "", "", "⚪️", "⚫️", "", "", ""], // 5行目
        ["", "", "", "", "", "", "", ""], // 6行目
        ["", "", "", "", "", "", "", ""], // 7行目
        ["", "", "", "", "", "", "", ""]  // 8行目
    ],
    currentPlayer: Player.Black,
    winner: null,
    draw: false
};
