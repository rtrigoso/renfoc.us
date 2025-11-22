'use client';

import Link from "next/link";
import { useRef, useEffect } from "react";

interface Position {
    x: number;
    y: number;
    w: number;
    h: number;
    shouldRemove: boolean;
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
            y: canvas.height - 10
        },
        score: 0
    };
    
    const DIRECTION_RIGHT = 'right';
    const DIRECTION_LEFT = 'left';
    const SPEED_AMOUNT_IN_PX = 3;
    
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
        ctx.fillRect(state.position.x, state.position.y, 10, 10);
    }

    function createObstacle () {
        const randomX = Math.floor(Math.random() * canvas.width - 1) + 1;
        const w = Math.floor(Math.random() * 50);
        const h = Math.floor(Math.random() * 50);
        obstacles.push(
          { x: randomX, y: 0, w, h, shouldRemove: false }  
        );
    }

    function drawObstacles (ctx: CanvasRenderingContext2D) {
        for (const obstacle of obstacles) {
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.moveTo(obstacle.x, obstacle.y);
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        }
    }

    function finish (ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "14px monospace";
        ctx.fillText("GAME OVER", canvas.width / 2 - 40, canvas.height / 2);
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

        return (Ax2 > Bx1 && Ax1 < Bx2 && Ay2 > By1 && Ay1 < By2);
    }

    function writeScore (ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.font = "14px monospace";
        ctx.fillText(`${state.score}`, 10, 20);
    }

    function moveObstacles (ctx: CanvasRenderingContext2D) {
        createObstacles(10 - obstacles.length);
        for (const obstacle of obstacles) {
            obstacle.y += SPEED_AMOUNT_IN_PX;

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
            createObstacle();
        }
    }

    createObstacles(10);

    const gl = new GameLoop(
        function () {
            if (state.direction === DIRECTION_RIGHT) state.position.x += SPEED_AMOUNT_IN_PX;
            if (state.direction === DIRECTION_LEFT) state.position.x -= SPEED_AMOUNT_IN_PX;
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
    
    return (
        <canvas ref={ref} id="game_container">
        </canvas>
    );
}

