import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard";
import { GameStatus } from '@/components/ormanisms/GameStatus/GameStatus';
import { useMarkGame } from '@/providers/MarkGameProvider';
import { markGameTitle } from './features';
import style from './style.module.css';

let initEffect = false; // ここで定義

export const MarkGame: React.FC = () => {
    const { gameState, initMarkGameState, onGameBoardClick } = useMarkGame();

    useEffect(() => {
        if (initEffect) {
            return;
        }
        initEffect = true;
        initMarkGameState();
        console.debug('useEffect!');
    }, []);

    return (
        <>
            <Head>
                <title>{markGameTitle()}</title>
            </Head>
            <p className='desc'>MarkGameVersion2.tsx</p>
            リバーシゲーム
            <div className={style.field}>
                <GameBoard gameState={gameState} onGameBoardClick={onGameBoardClick} />
                <GameStatus gameState={gameState} onGameResetClick={initMarkGameState} />
            </div>
        </>
    );
}
