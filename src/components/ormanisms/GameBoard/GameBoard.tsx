import { GameState, convertMarkGameCols, getValidMoves } from '@/components/templates/MarkGame/features';
import style from './style.module.css';

// Squareの型定義
type SquareProps = {
    children: string, // マスに表示する内容
    onSquareClick: Function, // マスがクリックされたときの処理
    isValidMove: boolean // 置けるマスかどうか
}

// Squareコンポーネントの定義
const Square: React.FC<SquareProps> = ({children, onSquareClick, isValidMove}) => {
    return (
        <td
            className={`${style.square} ${isValidMove ? style['valid-move'] : ''}`} // スタイルの適用
            onClick={() => {onSquareClick();}} // クリックイベントのハンドリング
        >
            {children}  
        </td>// マスに表示する内容
    )
}

// GameBoardの型定義
export type GameBoardProps = {
    gameState: GameState, // ゲームの状態
    onGameBoardClick: (row: number, col: number) => void; // 盤面がクリックされたとき
}

// GameBoardコンポーネントの定義
export const GameBoard: React.FC<GameBoardProps> = ({gameState, onGameBoardClick}) => {
    const boardWidth = gameState.boardWidth; // 幅
    const boardData = gameState.boardData; // 盤面のデータ
    const cols = convertMarkGameCols(boardWidth, boardData); // 盤面のデータを列に変換
    const validMoves = getValidMoves(boardData, gameState.currentPlayer, boardWidth); // 置けるマスを取得

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
                                    onSquareClick={() => onGameBoardClick(rowIdx, colIdx)} // マスがクリックされたときの処理
                                    isValidMove={validMoves.some(([r, c]) => r === rowIdx && c === colIdx)} // 置けるマスかどうかの判定
                                >
                                    {cell} 
                                </Square>// マスに表示する内容
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
