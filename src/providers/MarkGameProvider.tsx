import { getWinner, isCellEmpty, flipDiscs, getValidMoves, initialState, GameState, Player } from "@/components/templates/MarkGame/features";
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
            boardData: initialState.boardData.map(row => [...row])
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
    
        // クリックされたセルが有効な手の中にあり、かつゲームが終了していない場合
        if (validMoves.some(([r, c]) => r === row && c === col) && gameState.winner == null) {
            // 現在のゲーム状態から必要な情報を取得
            var boardData = gameState.boardData;
            var currentPlayer = gameState.currentPlayer;
            var boardWidth = gameState.boardWidth;
    
            // マスに現在のプレイヤーの駒を置く
            boardData[row][col] = currentPlayer;
    
            // 挟まれた駒をひっくり返す
            boardData = flipDiscs(boardData, row, col, currentPlayer, boardWidth);
    
            // チェンジ
            currentPlayer = currentPlayer === Player.Black ? Player.White : Player.Black;
    
            // 盤面が全て埋まったかどうかを判定させる
            var draw = boardData.flat().filter((cell) => cell === '').length === 0;
    
            // 勝者を決める
            var winner = draw ? getWinner(gameState) : null;
    
            // 新しいゲーム状態をディスパッチして更新
            dispatch({
                type: ActionType.updateGameState,
                payload: {
                    gameState: {boardWidth, boardData, currentPlayer, winner, draw}
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
