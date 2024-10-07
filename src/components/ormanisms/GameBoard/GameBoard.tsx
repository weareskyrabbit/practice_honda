import { GameState, convertMarkGameCols } from '@/components/templates/MarkGame/features';
import style from './style.module.css';

type SquareProps = {
    children: string,
    onSquareClick: Function
}

const Square: React.FC<SquareProps> = ({children, onSquareClick}) => {
    return (
        <td className={style.square} onClick={() => {onSquareClick();}}>
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

    return (
        <div>
            <p className='desc'>GameBoard.tsx</p>
            <table>
                <tbody>
                    {cols.map((row, rowIdx) => (
                        <tr key={'board-tr-' + rowIdx}>
                            {row.map((cell, colIdx) => (
                                <Square
                                    key={'board-td-' + rowIdx + '-' + colIdx}
                                    onSquareClick={() => onGameBoardClick(rowIdx, colIdx)}
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
