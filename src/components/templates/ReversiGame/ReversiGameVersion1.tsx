import Head from 'next/head';
import { useEffect } from 'react';
import { GameBoard } from "@/components/ormanisms/GameBoard";
import { GameStatus } from '@/components/ormanisms/GameStatus';
import { useReversiGame } from '@/components/templates/ReversiGame/features';
import style from './style.module.css';

var initEffect = false;

export const ReversiGame: React.FC = () => {
    const { gameState, initReversiGameState, onGameBoardClick } = useReversiGame();

    useEffect(() => {
        if (initEffect) {
            return;
        }
        initEffect = true;
        initReversiGameState();
        console.debug('useEffect!');
    }, []);

    return <>
        <Head>
            <title>Reversi Game</title>
        </Head>
        <p className='desc'>ReversiGame.tsx</p>
        リバーシゲーム(useReducerで状態管理)
        <div className={style.field}>
            <GameBoard gameState={gameState} onGameBoardClick={
                (index) => onGameBoardClick(index)
            } />
            <GameStatus gameState={gameState} onGameResetClick={() => {
                initReversiGameState(); 
            }} />
        </div>
    </>;
}
