'use client';

import { useGame } from "@/composites/useGame";

export default function Game() {
    const { ref, mobileInputRef, isScoreboard, activeScreen, activeScreenConfig, handleRestart } = useGame();

    return (
        <>
            <div className={`game_wrapper${isScoreboard ? ' open' : ''}`} aria-hidden="true">
                <input
                    ref={mobileInputRef}
                    type="text"
                    maxLength={3}
                    className="mobile_score_input"
                    aria-hidden="true"
                    tabIndex={-1}
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
