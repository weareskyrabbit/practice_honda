import { GameState, Player } from '@/components/templates/MarkGame/features';

export type GameStatusProps = {
    gameState: GameState,
    onGameResetClick: () => void;
}

export const GameStatus: React.FC<GameStatusProps> = ({gameState, onGameResetClick}) => {
    var currentPlayer = gameState.currentPlayer;
    var winner = gameState.winner;
    var draw = gameState.draw;

    return <div>
        <p className='desc'>ReversiGameStatus.tsx</p>
            <div className='small'>
                {winner == null && !draw && (
                    <>現在のプレイヤー：{currentPlayer === Player.Black ? <>⚫️(黒)</> : <>⚪️(白)</>}<br /></>
                )}
                {winner != null && <>{winner}が勝ちました。<br /></>}
                {draw && <>引き分けです。<br /></>}
                <div onClick={onGameResetClick}>リセット</div>
            </div>
    </div>;
}