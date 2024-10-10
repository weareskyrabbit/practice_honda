import { getWinner, flipDiscs, getValidMoves, initialState, GameState, Player } from "@/components/templates/MarkGame/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

interface MarkGameContext {
    gameState: GameState,
    initMarkGameState: () => void,
    onGameBoardClick: (row: number, col: number) => void
}
const MarkGameContext = createContext({} as MarkGameContext);
export const useMarkGame = () => React.useContext(MarkGameContext);

enum ActionType {
    updateGameState,
}
type Action =
{
    type: ActionType.updateGameState,
    payload: {
        gameState: GameState
    }
};

export const MarkGameProvider: React.FC<{children: ReactNode}> = ({
    children
}) => {
    const initMarkGameState = () => {
        const newInitialState = {
            ...initialState,
            boardData: initialState.boardData.map(row => [...row]),
            currentPlayer: Math.random() < 0.5 ? Player.Black : Player.White // ランダムで先攻を決定
        };
        console.debug('Initializing game state to newInitialState:', newInitialState);
        dispatch({type: ActionType.updateGameState, payload: {
            gameState: newInitialState
        }});
    };
    
    const onGameBoardClick = (row: number, col: number) => {
        console.debug('click row=' + row + ' col=' + col); // クリックされたところをデバッグで出力
    
        // 現在のプレイヤーが置けるマスを取得
        const validMoves = getValidMoves(gameState.boardData, gameState.currentPlayer, gameState.boardWidth);
    
        if (validMoves.length === 0) {
            // パスの通知を表示
            const newPassCount = gameState.passCount + 1;
            const newCurrentPlayer = gameState.currentPlayer === Player.Black ? Player.White : Player.Black;
    
            // パスが2連続で行われた場合の勝利判定
            if (newPassCount >= 2) {
                const blackCount = gameState.boardData.flat().filter(cell => cell === Player.Black).length;
                const whiteCount = gameState.boardData.flat().filter(cell => cell === Player.White).length;
                const winner = blackCount > whiteCount ? Player.Black : (whiteCount > blackCount ? Player.White : null);
                const draw = blackCount === whiteCount;
    
                if (newPassCount === 2) {
                    if (winner) {
                        alert(`${winner}が勝ちました。`);
                    } else if (draw) {
                        alert('引き分けです。');
                    }
                }
    
                dispatch({
                    type: ActionType.updateGameState,
                    payload: {
                        gameState: { ...gameState, winner, draw, passCount: newPassCount }
                    }
                });
            } else {
                alert('取れる駒が無いためパスをします。');
                dispatch({
                    type: ActionType.updateGameState,
                    payload: {
                        gameState: { ...gameState, currentPlayer: newCurrentPlayer, passCount: newPassCount }
                    }
                });
            }
            return;
        }
    
        // クリックされたセルが有効な手の中にあり、かつゲームが終了していない場合
        if (validMoves.some(([r, c]) => r === row && c === col) && gameState.winner == null) {
            // 現在のゲーム状態から必要な情報を取得
            let boardData = gameState.boardData;
            let currentPlayer = gameState.currentPlayer;
            const boardWidth = gameState.boardWidth;
    
            // マスに現在のプレイヤーの駒を置く
            boardData[row][col] = currentPlayer;
    
            // 挟まれた駒をひっくり返す
            boardData = flipDiscs(boardData, row, col, currentPlayer, boardWidth);
    
            // 盤面が全て埋まったかどうかを判定
            const isBoardFull = boardData.flat().every(cell => cell !== '');
    
            // 勝者を決める
            const winner = isBoardFull ? getWinner(gameState) : null;
    
            // 引き分けの判定
            const draw = isBoardFull && winner === null;
    
            // チェンジ
            currentPlayer = currentPlayer === Player.Black ? Player.White : Player.Black;
    
            // 新しいゲーム状態をディスパッチして更新
            dispatch({
                type: ActionType.updateGameState,
                payload: {
                    gameState: { boardWidth, boardData, currentPlayer, winner, draw, passCount: 0 } // パスカウントをリセット
                }
            });
        } else {
            console.debug('invalid index!'); // 無効なセルがクリックおされたときのデバッグで出力
        }
    }
    

    const reducer = (_: GameState, action: Action): GameState => {
        switch (action.type) {
            case ActionType.updateGameState:
                console.debug('Updating game state to:', action.payload.gameState);
                return action.payload.gameState;
        }
    };
    

    const [gameState, dispatch] = useReducer(reducer, initialState);

    return (
        <MarkGameContext.Provider value={{
            gameState, initMarkGameState, onGameBoardClick
        }}>
            {children}
        </MarkGameContext.Provider>
    );
}
