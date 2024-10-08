import { GameState, Player } from '@/components/templates/MarkGame/features';
import style from './style.module.css';

// GameStatusの型の定義
export type GameStatusProps = {
    gameState: GameState, // ゲームの状態
    onGameResetClick: () => void; // リセットボタンがクリックされたとき
}

// GameStatusの定義
export const GameStatus: React.FC<GameStatusProps> = ({gameState, onGameResetClick}) => {
    const currentPlayer = gameState.currentPlayer; // 現在のプレイヤー
    const winner = gameState.winner; // 勝者
    const draw = gameState.draw; // 引き分けか

    return (
        <div>
            <p className='desc'>ReversiGameStatus.tsx</p>
            <div className={`${style.status}`}>{/* ゲームが進行中の場合 */}
                {winner == null && !draw && (
                    <>現在のプレイヤー：{currentPlayer === Player.Black ? <>⚫️(黒)</> : <>⚪️(白)</>}<br /></>
                )}{/* 勝者が決まった場合 */}
                {winner != null && <>{winner}が勝ちました。<br /></>}{/* 引き分けの場合 */}
                {draw && <>引き分けです。<br /></>}{/* リセットボタン */}
                <div className={style.reset} onClick={onGameResetClick}>リセット</div>
            </div>
        </div>
    );
}
