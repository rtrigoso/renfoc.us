'use client';

import Link from "next/link";
import { useRef, useEffect } from "react";

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
    speed?: number;
    shouldRemove: boolean;
    isPowerup?: boolean
}

class GameLoop {
    private lastFrameTime = 0;
    private FPS = 30;
    private FrameInterval = 1000 / this.FPS;
    private state = {};
    private render: Function;
    private isDone = false;

    constructor ( renderCallback: Function) {
        if (!window) throw new Error('global window object is required but not found');

        this.render = renderCallback;
    }

    run() {
        window.requestAnimationFrame(this.loop.bind(this));        
    }

    stop () {
        this.isDone = true;
    }

    loop (currentTime: number) {
        if (this.isDone) return;
        
        this.run();
        
        const deltaTime = currentTime - this.lastFrameTime;
        if (deltaTime >= this.FrameInterval) {
            this.lastFrameTime = currentTime - (deltaTime % this.FrameInterval);
            this.render();
        }
    }
}

function setup (canvas: HTMLCanvasElement) {
    let obstacles: Position[] = [];
    let isGameOver = false;
    let state = {
        direction: '',
        position: {
            x: canvas.width / 2 - 1,
            y: canvas.height - 10,
            w: 10,
            h: 10
        },
        score: 0,
        speed: 3
    };
    
    const DIRECTION_RIGHT = 'right';
    const DIRECTION_LEFT = 'left';
    
    const ctx = canvas.getContext('2d');
    const { width, height, left, top } = canvas.getBoundingClientRect();
    const x = left + (width / 2);
    const y = top + (height / 2);

    function handleClick (e: MouseEvent) {
        e.preventDefault();
        const { layerX, layerY } = e;

        switch(true) {
            case layerX >= left && layerX <= x:
                state.direction = 'left';
                break;
            case layerX >= x && layerX <= (left + width):
                state.direction = 'right';
        }

        if (isGameOver) {
            isGameOver = false;
            setup(canvas);            
        }
    }

    function clearState (e: MouseEvent) {
        e.preventDefault();
        state.direction = '';
    }

    canvas.addEventListener('pointerdown', handleClick);
    canvas.addEventListener('pointerup', clearState);

    function drawPlayer (ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.moveTo(state.position.x, state.position.y);
        ctx.fillRect(state.position.x, state.position.y, state.position.w, state.position.h);
        ctx.fillStyle = 'black';

        const leftEyeLocation = state.position.x + (state.direction === DIRECTION_RIGHT ? 6 : state.direction === DIRECTION_LEFT ? 0: 6);
        const rightEyeLocation = state.position.x + (state.direction === DIRECTION_RIGHT ? 9 : state.direction === DIRECTION_LEFT ? 3 : 3);
        const shouldBlink = state.score % 20 <= 5 ? 1 : 4;

        ctx.moveTo(leftEyeLocation, state.position.y + 5);
        ctx.fillRect(leftEyeLocation, state.position.y + 5, 2, shouldBlink);
        ctx.moveTo(rightEyeLocation, state.position.y + 5);
        ctx.fillRect(rightEyeLocation, state.position.y + 5, 2, shouldBlink);
    }

    function createObstacle (isPowerup = false) {
        const randomX = Math.floor(Math.random() * canvas.width - 1) + 1;
        const randomY = Math.floor(Math.random() * 20);
        const w = Math.floor(Math.random() * 25) + 10;
        const h = Math.floor(Math.random() * 25) + 10;
        const speed = Math.floor(Math.random() * 5) + 1;
        obstacles.push(
          { x: randomX, y: -randomY, w, h, shouldRemove: false, isPowerup, speed }  
        );
    }

    function drawObstacles (ctx: CanvasRenderingContext2D) {
        for (const obstacle of obstacles) {
            ctx.beginPath();
            ctx.fillStyle = obstacle?.isPowerup ? 'yellow' : 'green';
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        }
    }

    function finish (ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText("GAME OVER", canvas.width / 2 - 40, canvas.height / 2);
        ctx.font = "normal 14px monospace";
        ctx.fillText("click to restart", canvas.width / 2 - 72, canvas.height / 2 + 16);
    }

    function checkForGameOver ( position: Position ) {
        const Ax2 = state.position.x + 10;
        const Ax1 = state.position.x;
        const Bx1 = position.x;
        const Bx2 = position.x + position.w;
        const Ay1 = state.position.y;
        const Ay2 = state.position.y + 10;
        const By1 = position.y;
        const By2 = position.y + position.h;

        const hitBox =  (Ax2 > Bx1 && Ax1 < Bx2 && Ay2 > By1 && Ay1 < By2);
        if (hitBox && !position.isPowerup) return true;
        if (hitBox && position.isPowerup) {
            state.position.w = 5;
            state.position.h = 5;
            setTimeout(function() {
                state.position.w = 10;
                state.position.h = 10;
            }, 1000 * 2); // half a second
        }
        
        return false;
    }

    function writeScore (ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "bold 14px monospace";
        ctx.fillText(`${state.score}`, 10, 20);
    }

    function getObstaclesMaxCount () {
        if (state.score < 100) return 10;
        return 10 + (state.score / 100);
    }

    function moveObstacles (ctx: CanvasRenderingContext2D) {
        const maxObstacles = getObstaclesMaxCount();
        createObstacles(maxObstacles - obstacles.length);
        
        for (const obstacle of obstacles) {
            obstacle.y += obstacle?.speed || 3;

            if (obstacle.y > canvas.height) {
                obstacle.shouldRemove = true;
            }

            isGameOver = checkForGameOver(obstacle);
            if (isGameOver) break;
        }

        obstacles = obstacles.filter(({shouldRemove}) => !shouldRemove);
    }

    function createObstacles (x: number) {
        for (let i = 0; i < x; i++) {
            const r = Math.floor(Math.random() * 20);
            createObstacle(r === 10);
        }
    }

    createObstacles(10);

    const gl = new GameLoop(
        function () {
            if (state.direction === DIRECTION_RIGHT && state.position.x < canvas.width - 10) state.position.x += state.speed;
            if (state.direction === DIRECTION_LEFT && state.position.x >= 0) state.position.x -= state.speed;
            if (!ctx) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPlayer(ctx);
            moveObstacles(ctx);
            drawObstacles(ctx);
            writeScore(ctx);
            state.score += 1;
            
            if (isGameOver) {
                finish(ctx);
                gl.stop();
            }
       }
    );

    gl.run();
}

export default function Game() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        setup(ref.current); 
    }, []);

    function toggleGameView () {
        const x = document.querySelector('.game_wrapper');
        const isOpen = x?.classList.contains('open');

        if (isOpen) x?.classList.remove('open');
        else x?.classList.add('open');
    }
    
    return (
        <>
            <button
              className="game_wrapper_toggle"
              title="wanna play?"
              onClick={toggleGameView}
              aria-label="JS enabled? play a game by clicking on this button">
              &#x1F3AE;
            </button>
            <div className="game_wrapper">
                <canvas ref={ref} id="game_container">
                </canvas>
            </div>
        </>
    );
}

