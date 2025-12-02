###### 12/02/25
# Building a JS Game Loop: A Practical Guide

Game development in the browser has come a long way, and at the heart of smooth, performant games is the `requestAnimationFrame` API. In this post, we'll explore how to build a proper game loop using `requestAnimationFrame`, complete with frame rate limiting and state management—all based on a real working example.

## Why requestAnimationFrame?

Before we dive in, let's understand why `requestAnimationFrame` is the go-to choice for browser-based games:

- **Optimized for animations**: The browser calls your callback before the next repaint, ensuring smooth visuals
- **Automatic pausing**: When the tab is hidden, `requestAnimationFrame` pauses, saving CPU and battery
- **60 FPS target**: Syncs with the display's refresh rate (typically 60Hz)
- **Better than `setInterval`**: More precise timing and better performance

## The Game Loop Class

Let's start by building a reusable `GameLoop` class that handles the frame timing logic:

```typescript
class GameLoop {
    private lastFrameTime = 0;
    private FPS = 30;
    private FrameInterval = 1000 / this.FPS;
    private render: Function;
    private isDone = false;

    constructor(renderCallback: Function) {
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
```

### Breaking Down the Loop

**The Constructor**: Takes a callback function that will handle your game's rendering and logic each frame.

**The run() Method**: Kicks off the animation loop by calling `requestAnimationFrame`, which schedules the `loop` method to run before the next repaint.

**The loop() Method**: This is where the magic happens. `requestAnimationFrame` automatically passes a `currentTime` timestamp to your callback. We use this to:

1. **Check if we should stop**: The `isDone` flag lets us cleanly exit the loop
2. **Schedule the next frame**: We recursively call `run()` to keep the loop going
3. **Limit frame rate**: Calculate `deltaTime` to ensure we only render at our target FPS

## Frame Rate Limiting with Delta Time

You might wonder: "Why limit the frame rate if `requestAnimationFrame` already targets 60 FPS?"

Great question! Here's why delta time is crucial:

```typescript
const deltaTime = currentTime - this.lastFrameTime;
if (deltaTime >= this.FrameInterval) {
    this.lastFrameTime = currentTime - (deltaTime % this.FrameInterval);
    this.render();
}
```

This pattern:
- Gives you **control over game speed**: A 30 FPS game runs at the same speed on 60Hz and 144Hz displays
- **Ensures consistency**: Your game logic executes at predictable intervals
- **Prevents over-rendering**: Saves resources by only rendering when needed

The modulo operation `(deltaTime % this.FrameInterval)` carries over any excess time, preventing time drift over long sessions.

## Putting It to Use: A Complete Game Example

Here's how you'd use the `GameLoop` to power an actual game:

```typescript
function setup(canvas: HTMLCanvasElement) {
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

    const ctx = canvas.getContext('2d');

    const gl = new GameLoop(function() {
        // Update game state
        if (state.direction === 'right' && state.position.x < canvas.width - 10) {
            state.position.x += state.speed;
        }
        if (state.direction === 'left' && state.position.x >= 0) {
            state.position.x -= state.speed;
        }
        
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Render everything
        drawPlayer(ctx);
        moveObstacles(ctx);
        drawObstacles(ctx);
        writeScore(ctx);
        
        // Update score
        state.score += 1;
        
        // Check game over
        if (isGameOver) {
            finish(ctx);
            gl.stop();
        }
    });

    gl.run();
}
```

## The Game Loop Pattern

Every frame, our callback follows this pattern:

1. **Update State**: Move the player based on input
2. **Clear Canvas**: Wipe the previous frame
3. **Render Everything**: Draw player, obstacles, UI elements
4. **Update Game Logic**: Increment score, check collisions
5. **Check Exit Conditions**: Stop the loop if the game is over

## Integrating with React

In a React application, you'll typically initialize your game in a `useEffect` hook:

```typescript
export default function Game() {
    const ref = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        setup(ref.current); 
    }, []);

    return (
        <div className="game_wrapper">
            <canvas ref={ref} id="game_container" />
        </div>animate
    );
}
```

The empty dependency array ensures `setup` only runs once when the component mounts.

## Key Takeaways

1. **Use `requestAnimationFrame`** for smoother animations that sync with the display
2. **Implement delta time** to control frame rate and ensure consistent game speed
3. **Bind your callback properly** with `.bind(this)` to maintain context
4. **Provide a stop mechanism** for clean game-over states and memory management
5. **Separate concerns**: Keep your game loop logic separate from your rendering logic

## Beyond the Basics

This game loop can be extended with:
- **Variable time steps**: Use delta time to smooth movement on different frame rates
- **Fixed time step with interpolation**: For physics-heavy games
- **Performance monitoring**: Track actual FPS vs target FPS
- **Pause/resume functionality**: Add a paused state that skips rendering

The `requestAnimationFrame` API is powerful yet simple. With a solid game loop foundation, you can build everything from simple arcade games to complex simulations—all running smoothly in the browser.

And if you want to see it in action, I wrote a small arcade game, which you can play on the homepage of my blog. Just click the videogame controller.

Happy coding!
