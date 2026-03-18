'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { saveScore } from "@/utils/scoreboard";

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
    speed?: number;
    shouldRemove: boolean;
    isPowerup?: boolean;
}

interface OverlayScreenProps {
    data: Record<string, unknown>;
    onRestart: () => void;
}

interface OverlayScreenConfig {
    id: string;
    component: React.ComponentType<OverlayScreenProps>;
}

// --- Overlay screen registry: add React overlay screens here ---

const OVERLAY_SCREENS: OverlayScreenConfig[] = [];

// --- Canvas game ---

const DIRECTION_RIGHT = 'right';
const DIRECTION_LEFT = 'left';
const PLAYER_SIZE = 10;
const BASE_MAX_OBSTACLES = 10;
const POWERUP_SHRINK_MS = 2000;

type ShowScreenFn = (id: string, data: Record<string, unknown>) => void;
type CanvasScreen = 'gameplay' | 'submit-score';

class GameLoop {
    private lastFrameTime = 0;
    private FPS = 30;
    private FrameInterval = 1000 / this.FPS;
    private render: () => void;
    private isDone = false;

    constructor(renderCallback: () => void) {
        if (!window) throw new Error('global window object is required but not found');
        this.render = renderCallback;
    }

    run() {
        window.requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.isDone = true;
    }

    loop(currentTime: number) {
        if (this.isDone) return;

        this.run();

        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime >= this.FrameInterval) {
            this.lastFrameTime = currentTime - (deltaTime % this.FrameInterval);
            this.render();
        }
    }
}

function setup(canvas: HTMLCanvasElement, skipStartScreen = false, onShowScreen?: ShowScreenFn, onSaveScore?: (name: string, score: number) => void) {
    let obstacles: Position[] = [];
    let isGameOver = false;
    let canvasScreen: CanvasScreen = 'gameplay';
    let submitName = '';
    let activeClickables: { bounds: { x: number; y: number; w: number; h: number }; onClick: () => void }[] = [];
    let state = {
        direction: '',
        position: { x: canvas.width / 2 - 1, y: canvas.height - 10, w: PLAYER_SIZE, h: PLAYER_SIZE },
        score: 0,
        speed: 3
    };

    const ctx = canvas.getContext('2d');
    let hasStarted = skipStartScreen;

    function drawClickableText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, onClick: () => void) {
        ctx.fillText(text, x, y);
        const { width } = ctx.measureText(text);
        activeClickables.push({ bounds: { x, y: y - 14, w: width, h: 18 }, onClick });
    }

    function checkClickables(e: MouseEvent): boolean {
        for (const { bounds: { x, y, w, h }, onClick } of activeClickables) {
            if (e.offsetX >= x && e.offsetX <= x + w && e.offsetY >= y && e.offsetY <= y + h) {
                onClick();
                return true;
            }
        }
        return false;
    }

    function drawStartScreen(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText("click to start", canvas.width / 2 - 54, canvas.height / 2);
        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "scoreboard", canvas.width / 2 - 42, canvas.height / 2 + 16, () => {
            window.location.href = '/scoreboard';
        });
    }

    function drawSubmitScreen(ctx: CanvasRenderingContext2D) {
        activeClickables = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';

        ctx.font = "bold 14px monospace";
        ctx.fillText("SUBMIT SCORE", canvas.width / 2 - 54, canvas.height / 2 - 32);

        ctx.font = "normal 14px monospace";
        ctx.fillText(`score: ${state.score}`, canvas.width / 2 - 35, canvas.height / 2 - 16);

        const inputX = canvas.width / 2 - 60;
        const inputY = canvas.height / 2 + 2;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(inputX, inputY, 120, 18);
        ctx.fillText(`${submitName}|`, inputX + 4, inputY + 13);

        drawClickableText(ctx, "submit", canvas.width / 2 - 24, canvas.height / 2 + 36, () => {
            if (submitName.trim()) onSaveScore?.(submitName.trim(), state.score);
            canvasScreen = 'gameplay';
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore);
        });
        drawClickableText(ctx, "restart", canvas.width / 2 - 28, canvas.height / 2 + 52, () => {
            canvasScreen = 'gameplay';
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore);
        });
    }

    function handleClick(e: MouseEvent) {
        e.preventDefault();

        if (canvasScreen === 'submit-score') {
            checkClickables(e);
            return;
        }

        const midX = canvas.width / 2;
        state.direction = (e.offsetX < midX) ? DIRECTION_LEFT : DIRECTION_RIGHT;

        if (!hasStarted) {
            if (checkClickables(e)) return;
            hasStarted = true;
            gl.run();
            return;
        }

        if (isGameOver) {
            checkClickables(e);
            return;
        }
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (canvasScreen !== 'submit-score' || !ctx) return;
        if (e.key === 'Backspace') {
            submitName = submitName.slice(0, -1);
        } else if (e.key === 'Enter') {
            if (submitName.trim()) onSaveScore?.(submitName.trim(), state.score);
            canvasScreen = 'gameplay';
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore);
            return;
        } else if (e.key.length === 1 && submitName.length < 20) {
            submitName += e.key;
        }
        drawSubmitScreen(ctx);
    }

    function clearState(e: MouseEvent) {
        e.preventDefault();
        state.direction = '';
    }

    canvas.addEventListener('pointerdown', handleClick);
    canvas.addEventListener('pointerup', clearState);
    window.addEventListener('keydown', handleKeyDown);

    function drawPlayer(ctx: CanvasRenderingContext2D) {
        const { x, y, w, h } = state.position;

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'black';

        const eyeOffset = state.direction === DIRECTION_RIGHT ? 6 : state.direction === DIRECTION_LEFT ? 0 : 6;
        const leftEyeX = x + eyeOffset;
        const rightEyeX = x + eyeOffset + 3;
        const eyeHeight = state.score % 20 <= 5 ? 1 : 4;

        ctx.fillRect(leftEyeX, y + 5, 2, eyeHeight);
        ctx.fillRect(rightEyeX, y + 5, 2, eyeHeight);
    }

    function createObstacle(isPowerup = false) {
        const x = Math.floor(Math.random() * canvas.width - 1) + 1;
        const y = -Math.floor(Math.random() * 20);
        const w = Math.floor(Math.random() * 25) + 10;
        const h = Math.floor(Math.random() * 25) + 10;
        const speed = Math.floor(Math.random() * 5) + 1;
        obstacles.push({ x, y, w, h, speed, shouldRemove: false, isPowerup });
    }

    function createObstacles(count: number) {
        for (let i = 0; i < count; i++) {
            createObstacle(Math.floor(Math.random() * 20) === 10);
        }
    }

    function drawObstacles(ctx: CanvasRenderingContext2D) {
        for (const obstacle of obstacles) {
            ctx.beginPath();
            ctx.fillStyle = obstacle.isPowerup ? 'yellow' : 'green';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        }
    }

    function checkCollision(obstacle: Position): boolean {
        const { x: px, y: py } = state.position;
        const hitBox = (
            px + PLAYER_SIZE > obstacle.x &&
            px < obstacle.x + obstacle.w &&
            py + PLAYER_SIZE > obstacle.y &&
            py < obstacle.y + obstacle.h
        );

        if (!hitBox) return false;

        if (obstacle.isPowerup) {
            state.position.w = 5;
            state.position.h = 5;
            setTimeout(() => {
                state.position.w = PLAYER_SIZE;
                state.position.h = PLAYER_SIZE;
            }, POWERUP_SHRINK_MS);
            return false;
        }

        return true;
    }

    function moveObstacles() {
        const maxObstacles = BASE_MAX_OBSTACLES + (state.score >= 100 ? state.score / 100 : 0);
        createObstacles(maxObstacles - obstacles.length);

        for (const obstacle of obstacles) {
            obstacle.y += obstacle.speed ?? 3;

            if (obstacle.y > canvas.height) obstacle.shouldRemove = true;

            isGameOver = checkCollision(obstacle);
            if (isGameOver) break;
        }

        obstacles = obstacles.filter(({ shouldRemove }) => !shouldRemove);
    }

    function writeScore(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText(`${state.score}`, 10, 20);
    }

    function drawGameOver(ctx: CanvasRenderingContext2D) {
        activeClickables = [];
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText("GAME OVER", canvas.width / 2 - 40, canvas.height / 2);
        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "click to restart", canvas.width / 2 - 72, canvas.height / 2 + 16, () => {
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore);
        });
        drawClickableText(ctx, "submit score", canvas.width / 2 - 55, canvas.height / 2 + 32, () => {
            canvasScreen = 'submit-score';
            if (ctx) drawSubmitScreen(ctx);
        });
        drawClickableText(ctx, "scoreboard", canvas.width / 2 - 42, canvas.height / 2 + 48, () => {
            window.location.href = '/scoreboard';
        });
    }

    createObstacles(BASE_MAX_OBSTACLES);

    const gl = new GameLoop(() => {
        if (state.direction === DIRECTION_RIGHT && state.position.x < canvas.width - PLAYER_SIZE) state.position.x += state.speed;
        if (state.direction === DIRECTION_LEFT && state.position.x >= 0) state.position.x -= state.speed;
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer(ctx);
        moveObstacles();
        drawObstacles(ctx);
        writeScore(ctx);
        state.score += 1;

        if (isGameOver) {
            drawGameOver(ctx);
            gl.stop();
        }
    });

    if (ctx && !skipStartScreen) drawStartScreen(ctx);
    if (skipStartScreen) gl.run();
}

export default function Game() {
    const ref = useRef<HTMLCanvasElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [activeScreen, setActiveScreen] = useState<{ id: string; data: Record<string, unknown> } | null>(null);

    const startGame = useCallback((skipStart: boolean) => {
        if (!ref.current) return;
        setup(ref.current, skipStart, (id, data) => setActiveScreen({ id, data }), saveScore);
    }, []);

    useEffect(() => { startGame(false); }, [startGame]);

    function handleRestart() {
        setActiveScreen(null);
        startGame(true);
    }

    const activeScreenConfig = OVERLAY_SCREENS.find(s => s.id === activeScreen?.id);

    return (
        <>
            <button
                className="game_wrapper_toggle"
                title="wanna play?"
                onClick={() => setIsOpen(prev => !prev)}
                aria-label="JS enabled? play a game by clicking on this button">
                &#x1F3AE;
            </button>
            <div className={`game_wrapper${isOpen ? ' open' : ''}`}>
                <canvas ref={ref} id="game_container" />
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
