import { useReducer } from 'react';

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

const initialState: GameState = {
    boardWidth: 8,
    boardData: Array(64).fill(''),
    currentPlayer: Player.Black,
    winner: null,
    draw: false
};

const gameReducer = (state: GameState, action: any): GameState => {
    switch (action.type) {
        case 'INIT':
            return {
                ...initialState,
                boardData: initialState.boardData.map((cell, index) => {
                    if (index === 27 || index === 36) return Player.White;
                    if (index === 28 || index === 35) return Player.Black;
                    return cell;
                })
            };
        case 'CLICK':
            const newState = { ...state };
            const row = Math.floor(action.index / 8);
            const col = action.index % 8;
            // クリック時のリバーシのロジックをここに追加
            return newState;
        default:
            return state;
    }
};

export const useReversiGame = () => {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);

    const initReversiGameState = () => {
        dispatch({ type: 'INIT' });
    };

    const onGameBoardClick = (index: number) => {
        dispatch({ type: 'CLICK', index });
    };

    return { gameState, initReversiGameState, onGameBoardClick };
};
