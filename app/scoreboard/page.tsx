'use client';

import { useCallback, useEffect, useState } from "react";
import { getScores, ScoreEntry } from "@/utils/scoreboard";

export default function Page() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchScores = useCallback(() => {
        setLoading(true);
        setError(false);
        getScores()
            .then(setScores)
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchScores();
        window.addEventListener('scoreSubmitted', fetchScores);
        return () => window.removeEventListener('scoreSubmitted', fetchScores);
    }, [fetchScores]);

    return (
        <>
            <h1>Scores</h1>
            {loading ? (
                <p className="loading">Loading scores</p>
            ) : error ? (
                <p>Failed to load scores. Try again later.</p>
            ) : scores.length === 0 ? (
                <p>No scores yet. Play the game to get on the board by clicking the game button on the bottom right corner.</p>
            ) : (
                <table id="scoreboard">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>score</th>
                            <th>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.map((entry, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{entry.name}</td>
                                <td>{entry.score}</td>
                                <td>{new Date(entry.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
}
