// プレイヤーの列挙型定義
export enum Player {
    Black = '⚫️', // 黒プレイヤー
    White = '⚪️'  // 白プレイヤー
}

// ゲームの状態を表すインターフェース
export interface GameState {
    boardWidth: number;
    boardData: string[][];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
    passCount: number; // パスの回数を追加
}


// タイトル
export const markGameTitle = () => {
    return 'リバーシゲーム';
}

// 指定されたマスが空かどうかを判定する関数
export function isCellEmpty(gameState: GameState, row: number, col: number) {
    return gameState.boardData[row][col] === '';
}

// 盤面データをそのまま返す関数（将来的に変換処理を追加する可能性あり）
export function convertMarkGameCols(boardWidth: number, boardData: string[][]): string[][] {
    return boardData;
}

// 勝者を判定する関数
export function getWinner(gameState: GameState): Player | null {
    const boardData = gameState.boardData;
    let blackCount = 0;
    let whiteCount = 0;

    // 各プレイヤーの駒の数をカウント
    boardData.forEach(row => {
        row.forEach(cell => {
            if (cell === Player.Black) blackCount++;
            if (cell === Player.White) whiteCount++;
        });
    });

    // 駒の数が多い方を勝者とする
    if (blackCount > whiteCount) return Player.Black;
    if (whiteCount > blackCount) return Player.White;
    return null; // 引き分けの場合
}

// 駒をひっくり返す関数
export const flipDiscs = (boardData: string[][], row: number, col: number, currentPlayer: Player, boardWidth: number): string[][] => {
    const directions = [
        [-1, 0], [1, 0], // 上下
        [0, -1], [0, 1], // 左右
        [-1, -1], [-1, 1], // 左上、右上
        [1, -1], [1, 1] // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const newBoardData = boardData.map(row => [...row]);

    // 各方向に対して駒をひっくり返す処理を行う
    directions.forEach(([dRow, dCol]) => {
        let r = row + dRow;
        let c = col + dCol;
        const discsToFlip = [];

        // 相手の駒が続く限り進む
        while (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === opponent) {
            discsToFlip.push([r, c]);
            r += dRow;
            c += dCol;
        }

        // 自分の駒で挟んでいる場合、駒をひっくり返す
        if (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === currentPlayer) {
            discsToFlip.forEach(([flipRow, flipCol]) => {
                newBoardData[flipRow][flipCol] = currentPlayer;
            });
        }
    });

    return newBoardData;
};

// 有効な手を取得する関数
export const getValidMoves = (boardData: string[][], currentPlayer: Player, boardWidth: number): [number, number][] => {
    const directions = [
        [-1, 0], [1, 0], // 上下
        [0, -1], [0, 1], // 左右
        [-1, -1], [-1, 1], // 左上、右上
        [1, -1], [1, 1] // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const validMoves: [number, number][] = [];

    // 盤面のマスに対して置けるマスかどうかを判定
    boardData.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            if (cell !== '') return;

            let isValid = false;
            directions.forEach(([dRow, dCol]) => {
                let r = rowIndex + dRow;
                let c = colIndex + dCol;
                let hasOpponentDisc = false;

                // 相手の駒が続く限り進む
                while (r >= 0 && r < boardWidth && c >= 0 && c < boardWidth && boardData[r][c] === opponent) {
                    hasOpponentDisc = true;
                    r += dRow;
                    c += dCol;
                }

                // 自分の駒で挟んでいる場合、置けるマスとする
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

// ゲームの初期状態
export const initialState: GameState = {
    boardWidth: 8,
    boardData: [
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "⚫️", "⚪️", "", "", ""],
        ["", "", "", "⚪️", "⚫️", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""]
    ],
    currentPlayer: Player.Black,
    winner: null,
    draw: false,
    passCount: 0 // パスの初期値
};
