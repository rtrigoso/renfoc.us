'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { saveScore } from "@/utils/scoreboard";
import { setup, OVERLAY_SCREENS } from "@/utils/game";

export default function Game() {
    const ref = useRef<HTMLCanvasElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const isScoreboard = pathname === '/scoreboard';
    const [activeScreen, setActiveScreen] = useState<{ id: string; data: Record<string, unknown> } | null>(null);
    const saveScoreAndNotify = useCallback(async (name: string, score: number) => {
        await saveScore(name, score);
        window.dispatchEvent(new CustomEvent('scoreSubmitted'));
    }, []);

    const startGame = useCallback((skipStart: boolean) => {
        if (!ref.current) return;
        return setup(ref.current, skipStart, (id, data) => setActiveScreen({ id, data }), saveScoreAndNotify, mobileInputRef.current ?? undefined);
    }, [saveScoreAndNotify]);

    useEffect(() => startGame(false), [startGame]);

    function handleRestart() {
        setActiveScreen(null);
        startGame(true);
    }

    const activeScreenConfig = OVERLAY_SCREENS.find(s => s.id === activeScreen?.id);

    return (
        <>
            <div className={`game_wrapper${isScoreboard ? ' open' : ''}`} aria-hidden="true">
                <input
                    ref={mobileInputRef}
                    type="text"
                    maxLength={3}
                    className="mobile_score_input"
                    aria-hidden="true"
                />
                <canvas ref={ref} id="game_container" height={250} aria-label="Arcade game. Requires clicking the screen to play." />
                {activeScreen && activeScreenConfig && (
                    <activeScreenConfig.component
                        data={activeScreen.data}
                        onRestart={handleRestart}
                    />
                )}
            </div>
        </>
    );
}
