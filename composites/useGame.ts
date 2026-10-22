'use client';

import { useRef, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import { saveScore } from "@/utils/scoreboard";
import { setup } from "@/utils/game";

export function useGame() {
    const ref = useRef<HTMLCanvasElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const isScoreboard = pathname === '/traffic';

    const saveScoreAndNotify = useCallback(async (name: string, score: number) => {
        await saveScore(name, score);
        window.dispatchEvent(new CustomEvent('scoreSubmitted'));
    }, []);

    const startGame = useCallback((skipStart: boolean) => {
        if (!ref.current) return;
        return setup(ref.current, skipStart, saveScoreAndNotify, mobileInputRef.current ?? undefined);
    }, [saveScoreAndNotify]);

    useEffect(() => startGame(false), [startGame]);

    function handleRestart() {
        startGame(true);
    }

    return { ref, mobileInputRef, isScoreboard, handleRestart };
}
