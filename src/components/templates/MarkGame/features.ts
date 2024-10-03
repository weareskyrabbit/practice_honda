// [!] exportで何ができるのか。
// 
export enum Player {
    Black = '⚫️',
    White = '⚪️'
}

export interface GameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}

// [!] 変数にはどのような値が入っているのか
// 
export const markGameTitle = () => {
    return 'リバーシゲーム';
}

export function isCellEmpty(gameState: GameState, index: number) {
    return gameState.boardData[index] == '';
}

export function convertMarkGameCols(boardWidth: number, boardData: string[]) {
    var cols: Array<Array<string>> = [];
    for (var rowIdx = 0; rowIdx < boardWidth; rowIdx++) {
        var row: Array<string> = [];
        for (var colIdx = 0; colIdx < boardWidth; colIdx++) {
            row.push(boardData[rowIdx * boardWidth + colIdx]);
        }
        cols.push(row);
    }
    return cols;
}


export function getWinner(gameState: GameState, index: number): Player | null {
    var boardWidth = gameState.boardWidth;
    var boardData = gameState.boardData;
    var cols = convertMarkGameCols(boardWidth, boardData);
    var rowIdx = Math.floor(index / boardWidth);
    var colIdx = index % boardWidth;
    var player: Player | null = cols[rowIdx][colIdx] as Player | null;

    // 右下方向のチェック
    var currentRowIdx = 0;
    var currentColIdx = 0;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }
        currentRowIdx++;
        currentColIdx++;
    }
    var crossLine1 = currentRowIdx == boardWidth;

    // 左下方向のチェック
    currentRowIdx = boardWidth - 1;
    currentColIdx = 0;
    while (currentRowIdx >= 0) {        
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }
        currentRowIdx--;
        currentColIdx++;
    }
    var crossLine2 = currentRowIdx < 0;

    // 縦方向のチェック
    currentRowIdx = rowIdx;
    currentColIdx = 0;
    while (currentColIdx < boardWidth) {        
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }
        currentColIdx++;
    }
    var verticalLine = currentColIdx == boardWidth;

    // 横方向のチェック
    currentRowIdx = 0;
    currentColIdx = colIdx;
    while (currentRowIdx < boardWidth) {
        if (cols[currentRowIdx][currentColIdx] != player) {
            break;
        }
        currentRowIdx++;
    }
    var horizontalLine = currentRowIdx == boardWidth;

    return crossLine1 || crossLine2 || verticalLine || horizontalLine ? player : null;
}



const flipDiscs = (boardData: string[], index: number, currentPlayer: Player, boardWidth: number): string[] => {
    const directions = [
        -1, 1, // 左右
        -boardWidth, boardWidth, // 上下
        -boardWidth - 1, -boardWidth + 1, // 左上、右上
        boardWidth - 1, boardWidth + 1 // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const newBoardData = [...boardData];

    directions.forEach(direction => {
        let i = index + direction;
        const discsToFlip = [];

        while (i >= 0 && i < boardData.length && boardData[i] === opponent) {
            discsToFlip.push(i);
            i += direction;
        }

        if (i >= 0 && i < boardData.length && boardData[i] === currentPlayer) {
            discsToFlip.forEach(flipIndex => {
                newBoardData[flipIndex] = currentPlayer;
            });
        }
    });

    return newBoardData;
};

export function makeMove(gameState: GameState, index: number) {
    if (isCellEmpty(gameState, index)) {
        gameState.boardData[index] = gameState.currentPlayer;
        gameState.boardData = flipDiscs(gameState.boardData, index, gameState.currentPlayer, gameState.boardWidth);
        gameState.currentPlayer = gameState.currentPlayer === Player.Black ? Player.White : Player.Black;
        gameState.winner = getWinner(gameState, index);
    }
}

const initialState: GameState = {
    boardWidth: 8,
    boardData: Array(64).fill(''),
    currentPlayer: Player.Black,
    winner: null,
    draw: false
};

