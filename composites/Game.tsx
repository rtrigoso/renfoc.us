'use client';

import { useRef, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { saveScore, ThrottleError } from "@/utils/scoreboard";

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
type CanvasScreen = 'gameplay' | 'submit-score' | 'score-submitted';

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

function setup(canvas: HTMLCanvasElement, skipStartScreen = false, onShowScreen?: ShowScreenFn, onSaveScore?: (name: string, score: number) => Promise<void>, mobileInput?: HTMLInputElement) {
    let obstacles: Position[] = [];
    let isGameOver = false;
    let canvasScreen: CanvasScreen = 'gameplay';
    let submitName = '';
    let submitError = '';
    let activeClickables: { bounds: { x: number; y: number; w: number; h: number }; onClick: () => void; text: string }[] = [];
    let flashingText = '';
    let clickThrottled = false;
    let state = {
        direction: '',
        position: { x: canvas.width / 2 - 1, y: canvas.height - 10, w: PLAYER_SIZE, h: PLAYER_SIZE },
        score: 0,
        speed: 3
    };

    const ctx = canvas.getContext('2d');
    let hasStarted = skipStartScreen;

    function drawClickableText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, onClick: () => void) {
        if (text === flashingText) ctx.fillStyle = 'yellow';
        ctx.fillText(text, x, y);
        if (text === flashingText) ctx.fillStyle = 'red';
        const { width } = ctx.measureText(text);
        activeClickables.push({ bounds: { x: x - width / 2, y: y - 14, w: width, h: 18 }, onClick, text });
    }

    function redrawCurrentScreen() {
        if (!ctx) return;
        if (canvasScreen === 'score-submitted') drawScoreSubmitted(ctx);
        else if (canvasScreen === 'submit-score') drawSubmitScreen(ctx);
        else if (isGameOver) drawGameOver(ctx);
        else if (!hasStarted) drawStartScreen(ctx);
    }

    function checkClickables(e: MouseEvent): boolean {
        if (clickThrottled) return false;
        for (const { bounds: { x, y, w, h }, onClick, text } of activeClickables) {
            if (e.offsetX >= x && e.offsetX <= x + w && e.offsetY >= y && e.offsetY <= y + h) {
                clickThrottled = true;
                flashingText = text;
                redrawCurrentScreen();
                setTimeout(() => {
                    flashingText = '';
                    onClick();
                }, 150);
                setTimeout(() => { clickThrottled = false; }, 1000);
                return true;
            }
        }
        return false;
    }

    function drawStartScreen(ctx: CanvasRenderingContext2D) {
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height / 2 - 15);
        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "SCOREBOARD", canvas.width / 2, canvas.height / 2 + 15, () => {
            window.location.href = '/scoreboard';
        });
    }

    function drawSubmitScreen(ctx: CanvasRenderingContext2D) {
        activeClickables = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';

        const cx = canvas.width / 2;
        ctx.font = "bold 14px monospace";
        ctx.fillText("SUBMIT SCORE", cx, canvas.height / 2 - 55);

        ctx.font = "normal 14px monospace";
        ctx.fillText(`SCORE: ${state.score}`, cx, canvas.height / 2 - 25);

        const inputX = cx - 60;
        const inputY = canvas.height / 2 - 5;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(inputX, inputY, 120, 18);
        ctx.textAlign = 'left';
        ctx.fillText(`${submitName.toUpperCase()}|`, inputX + 4, inputY + 13);
        ctx.textAlign = 'center';

        if (submitError) {
            ctx.font = "normal 11px monospace";
            ctx.fillText(submitError.toUpperCase(), cx, canvas.height / 2 + 10);
        }

        const submitY = submitError ? canvas.height / 2 + 53 : canvas.height / 2 + 43;
        const restartY = submitError ? canvas.height / 2 + 83 : canvas.height / 2 + 73;

        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "SUBMIT", cx, submitY, () => submitScore());
        drawClickableText(ctx, "RESTART", cx, restartY, () => {
            if (mobileInput) { mobileInput.blur(); mobileInput.value = ''; }
            canvasScreen = 'gameplay';
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore, mobileInput);
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

    function submitScore() {
        if (!submitName.trim() || !ctx) return;
        onSaveScore?.(submitName.trim().toUpperCase(), state.score)
            .then(() => {
                if (mobileInput) { mobileInput.blur(); mobileInput.value = ''; }
                canvasScreen = 'score-submitted';
                ctx!.clearRect(0, 0, canvas.width, canvas.height);
                drawScoreSubmitted(ctx!);
            })
            .catch((err: unknown) => {
                submitError = err instanceof ThrottleError ? err.message : 'submission failed.';
                drawSubmitScreen(ctx!);
            });
    }

    function handleKeyDown(e: KeyboardEvent) {
        if (canvasScreen !== 'submit-score' || !ctx) return;
        if (e.key === 'Backspace') {
            submitName = submitName.slice(0, -1);
        } else if (e.key === 'Enter') {
            submitScore();
            return;
        } else if (e.key.length === 1 && submitName.length < 3) {
            submitName += e.key;
        }
        drawSubmitScreen(ctx);
    }

    function handleMobileInput() {
        if (!mobileInput || !ctx) return;
        submitName = mobileInput.value.slice(0, 3);
        drawSubmitScreen(ctx);
    }

    function clearState(e: MouseEvent) {
        e.preventDefault();
        state.direction = '';
    }

    canvas.addEventListener('pointerdown', handleClick);
    canvas.addEventListener('pointerup', clearState);
    window.addEventListener('keydown', handleKeyDown);
    mobileInput?.addEventListener('input', handleMobileInput);

    function drawPlayer(ctx: CanvasRenderingContext2D) {
        const { x, y, w, h } = state.position;

        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = 'black';

        const eyeOffset = state.direction === DIRECTION_RIGHT ? 6 : state.direction === DIRECTION_LEFT ? 0 : 2;
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

    function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }

    function drawObstacles(ctx: CanvasRenderingContext2D) {
        for (const obstacle of obstacles) {
            ctx.beginPath();
            ctx.fillStyle = obstacle.isPowerup ? 'yellow' : 'green';
            if (obstacle.isPowerup) {
                const cx = obstacle.x + obstacle.w / 2;
                const cy = obstacle.y + obstacle.h / 2;
                const outerR = Math.min(obstacle.w, obstacle.h) / 2;
                drawStar(ctx, cx, cy, outerR, outerR * 0.4);
            } else {
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
            }
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
            obstacle.y += (obstacle.speed ?? 3) * 1.5625;

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
        ctx.textAlign = 'right';
        ctx.fillText(`${state.score}`, canvas.width - 10, 20);
        ctx.textAlign = 'left';
    }

    function drawGameOver(ctx: CanvasRenderingContext2D) {
        activeClickables = [];
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        const cx = canvas.width / 2;
        ctx.font = "bold 18px monospace";
        ctx.fillText("GAME OVER", cx, canvas.height / 2 - 45);
        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "CLICK TO RESTART", cx, canvas.height / 2 - 15, () => {
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore, mobileInput);
        });
        drawClickableText(ctx, "SUBMIT SCORE", cx, canvas.height / 2 + 15, () => {
            canvasScreen = 'submit-score';
            if (mobileInput) { mobileInput.value = ''; mobileInput.focus(); }
            if (ctx) drawSubmitScreen(ctx);
        });
        drawClickableText(ctx, "SCOREBOARD", cx, canvas.height / 2 + 45, () => {
            window.location.href = '/scoreboard';
        });
    }

    function drawScoreSubmitted(ctx: CanvasRenderingContext2D) {
        activeClickables = [];
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.fillStyle = 'red';
        const cx = canvas.width / 2;
        ctx.font = "bold 18px monospace";
        ctx.fillText("SCORE SUBMITTED", cx, canvas.height / 2 - 30);
        ctx.font = "normal 14px monospace";
        drawClickableText(ctx, "CLICK TO RESTART", cx, canvas.height / 2 + 0, () => {
            isGameOver = false;
            setup(canvas, true, onShowScreen, onSaveScore, mobileInput);
        });
        drawClickableText(ctx, "SCOREBOARD", cx, canvas.height / 2 + 30, () => {
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
    const mobileInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(pathname === '/scoreboard');
    const [activeScreen, setActiveScreen] = useState<{ id: string; data: Record<string, unknown> } | null>(null);

    const saveScoreAndNotify = useCallback(async (name: string, score: number) => {
        await saveScore(name, score);
        window.dispatchEvent(new CustomEvent('scoreSubmitted'));
    }, []);

    const startGame = useCallback((skipStart: boolean) => {
        if (!ref.current) return;
        setup(ref.current, skipStart, (id, data) => setActiveScreen({ id, data }), saveScoreAndNotify, mobileInputRef.current ?? undefined);
    }, [saveScoreAndNotify]);

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
                <input
                    ref={mobileInputRef}
                    type="text"
                    maxLength={3}
                    style={{ position: 'fixed', opacity: 0, left: '-9999px', top: 0, pointerEvents: 'none' }}
                    aria-hidden="true"
                />
                <canvas ref={ref} id="game_container" height={250} />
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
