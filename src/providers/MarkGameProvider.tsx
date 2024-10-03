import { getWinner, isCellEmpty } from "@/components/templates/MarkGame/features";
import React, { useReducer } from "react";
import { createContext, ReactNode } from "react";

export enum Player {
    Black = '⚫️',
    White = '⚪️'
}

interface MarkGameState {
    boardWidth: number;
    boardData: string[];
    currentPlayer: Player;
    winner: Player | null;
    draw: boolean;
}
interface MarkGameContext {
    gameState: MarkGameState,
    initMarkGameState: () => void,
    onGameBoardClick: (index: number) => void
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
        gameState: MarkGameState
    }
};

export const MarkGameProvider: React.FC<{children: ReactNode}> = ({
    children
}) => {
    var firstGameState: MarkGameState = {
        boardWidth: 8,
        boardData: Array(64).fill(''),
        currentPlayer: Player.Black,
        winner: null,
        draw: false
    };

    // 中央に初期配置を設定
    firstGameState.boardData[27] = Player.White;
    firstGameState.boardData[28] = Player.Black;
    firstGameState.boardData[35] = Player.Black;
    firstGameState.boardData[36] = Player.White;

    const initMarkGameState = (() => {
        dispatch({type: ActionType.updateGameState, payload: {
            gameState: firstGameState
        }});
    });

    const onGameBoardClick = (index: number) => {
        console.debug('click index=' + index);
        const validMoves = getValidMoves(gameState.boardData, gameState.currentPlayer, gameState.boardWidth);
        if (validMoves.includes(index) && gameState.winner == null) {
            var boardData = gameState.boardData;
            var currentPlayer = gameState.currentPlayer;
            var boardWidth = gameState.boardWidth;
            boardData[index] = currentPlayer;
            boardData = flipDiscs(boardData, index, currentPlayer, boardWidth);
            currentPlayer = currentPlayer === Player.Black ? Player.White : Player.Black;
            var winner = getWinner(gameState, index);
            var draw = boardData.filter((cell) => cell === '').length === 0;
            dispatch({type: ActionType.updateGameState, payload: {
                gameState: {boardWidth, boardData, currentPlayer, winner, draw}
            }});                    
        } else {
            console.debug('invalid index!');
        }
    }

    const reducer = (_: MarkGameState, action: Action): MarkGameState => {
        switch (action.type) {
            case ActionType.updateGameState:
                return action.payload.gameState;
        }
    }

    const [gameState, dispatch] = useReducer(reducer, firstGameState);

    return <MarkGameContext.Provider value={{
        gameState, initMarkGameState, onGameBoardClick
    }}>
    {children}
    </MarkGameContext.Provider>;
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

const getValidMoves = (boardData: string[], currentPlayer: Player, boardWidth: number): number[] => {
    const directions = [
        -1, 1, // 左右
        -boardWidth, boardWidth, // 上下
        -boardWidth - 1, -boardWidth + 1, // 左上、右上
        boardWidth - 1, boardWidth + 1 // 左下、右下
    ];

    const opponent = currentPlayer === Player.Black ? Player.White : Player.Black;
    const validMoves: number[] = [];

    boardData.forEach((cell, index) => {
        if (cell !== '') return;

        let isValid = false;
        directions.forEach(direction => {
            let i = index + direction;
            let hasOpponentDisc = false;

            while (i >= 0 && i < boardData.length && boardData[i] === opponent) {
                hasOpponentDisc = true;
                i += direction;
            }

            if (hasOpponentDisc && i >= 0 && i < boardData.length && boardData[i] === currentPlayer) {
                isValid = true;
            }
        });

        if (isValid) {
            validMoves.push(index);
        }
    });

    return validMoves;
};
