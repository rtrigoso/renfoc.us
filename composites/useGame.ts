'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { saveScore } from "@/utils/scoreboard";
import { setup, OVERLAY_SCREENS } from "@/utils/game";

export function useGame() {
    const ref = useRef<HTMLCanvasElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const isScoreboard = pathname === '/traffic';
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

    return { ref, mobileInputRef, isScoreboard, activeScreen, activeScreenConfig, handleRestart };
}
