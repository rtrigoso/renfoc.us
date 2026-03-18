const WORKER_URL = "https://cloudflare-to-supabase-proxy.renrocks.workers.dev";
const anonKey = "sb_publishable_m5lXQM9zBUDuCM43DLl7qg_qSzL0Ewf";

function authHeaders() {
    return {
        "Authorization": `Bearer ${anonKey}`,
        "Origin": window.location.origin
    };
}

const db = {
    async select<T>(table: string, query: string): Promise<T[]> {
        const res = await fetch(`${WORKER_URL}/${table}?${query}`, {
            headers: authHeaders()
        });
        if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
        return res.json();
    },

    async insert<T>(table: string, data: T): Promise<void> {
        const res = await fetch(`${WORKER_URL}/${table}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeaders()
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
    }
};

export interface ScoreEntry {
    name: string;
    score: number;
    date: string;
}

export async function getScores(): Promise<ScoreEntry[]> {
    return db.select<ScoreEntry>('scores', 'select=name,score,date&order=score.desc&limit=100');
}

const THROTTLE_KEY = 'score_last_submitted';
const THROTTLE_MS = 60_000;

export class ThrottleError extends Error {}

export async function saveScore(name: string, score: number): Promise<void> {
    const lastSubmitted = Number(localStorage.getItem(THROTTLE_KEY) ?? 0);
    const elapsed = Date.now() - lastSubmitted;

    if (elapsed < THROTTLE_MS) {
        const secondsLeft = Math.ceil((THROTTLE_MS - elapsed) / 1000);
        throw new ThrottleError(`Please wait ${secondsLeft}s before submitting again.`);
    }

    await db.insert('scores', { name, score, date: new Date().toISOString() });

    localStorage.setItem(THROTTLE_KEY, String(Date.now()));
}
