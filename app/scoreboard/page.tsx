'use client';

import { useEffect, useState } from "react";
import { getScores, ScoreEntry } from "@/utils/scoreboard";

export default function Page() {
    const [scores, setScores] = useState<ScoreEntry[]>([]);

    useEffect(() => {
        setScores(getScores());
    }, []);

    return (
        <>
            <h1>Scoreboard</h1>
            {scores.length === 0 ? (
                <p>No scores yet. Play the game to get on the board by clicking the game button on the bottom right corner..</p>
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
