import { GameState, convertMarkGameCols, getValidMoves } from '@/components/templates/MarkGame/features';
import style from './style.module.css';

type SquareProps = {
    children: string,
    onSquareClick: Function,
    isValidMove: boolean
}

const Square: React.FC<SquareProps> = ({children, onSquareClick, isValidMove}) => {
    return (
        <td
            className={`${style.square} ${isValidMove ? style['valid-move'] : ''}`}
            onClick={() => {onSquareClick();}}
        >
            {children}
        </td>
    )
}

export type GameBoardProps = {
    gameState: GameState,
    onGameBoardClick: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({gameState, onGameBoardClick}) => {
    const boardWidth = gameState.boardWidth;
    const boardData = gameState.boardData;
    const cols = convertMarkGameCols(boardWidth, boardData);
    const validMoves = getValidMoves(boardData, gameState.currentPlayer, boardWidth);

    return (
        <div>
            <p className='desc'>GameBoard.tsx</p>
            <table className={style.board}>
                <tbody>
                    {cols.map((row, rowIdx) => (
                        <tr key={'board-tr-' + rowIdx}>
                            {row.map((cell, colIdx) => (
                                <Square
                                    key={'board-td-' + rowIdx + '-' + colIdx}
                                    onSquareClick={() => onGameBoardClick(rowIdx, colIdx)}
                                    isValidMove={validMoves.some(([r, c]) => r === rowIdx && c === colIdx)}
                                >
                                    {cell}
                                </Square>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
