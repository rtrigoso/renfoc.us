const STORAGE_KEY = 'game_scores';
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
        return JSON.parse(raw) as ScoreEntry[];
    } catch {
        return [];
    }
}

export function saveScore(name: string, score: number): void {
    const scores = getScores();
    scores.push({ name, score, date: new Date().toISOString() });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores.slice(0, MAX_SCORES)));
}
