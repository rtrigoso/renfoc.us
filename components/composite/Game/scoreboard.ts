const STORAGE_KEY = 'high_scores';
const MAX_SCORES = 100;

export interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

export function getScores(): ScoreEntry[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const entries: ScoreEntry[] = JSON.parse(raw);
        return entries.sort((a, b) => b.score - a.score);
    } catch {
        return [];
    }
}

const THROTTLE_KEY = 'score_last_submitted';
const THROTTLE_MS = 60_000;

export class ThrottleError extends Error {}

export function saveScore(name: string, score: number): void {
    const lastSubmitted = Number(localStorage.getItem(THROTTLE_KEY) ?? 0);
    const elapsed = Date.now() - lastSubmitted;

    if (elapsed < THROTTLE_MS) {
        const secondsLeft = Math.ceil((THROTTLE_MS - elapsed) / 1000);
        throw new ThrottleError(`Please wait ${secondsLeft}s before submitting again.`);
    }

    const entries = getScores();
    entries.push({ name, score, date: new Date().toISOString() });
    entries.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_SCORES)));
    localStorage.setItem(THROTTLE_KEY, String(Date.now()));
}
