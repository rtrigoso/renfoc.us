/*

eurorack module component
-------------------------
1. OOD Classes
  - Rack - stores state of patchs and active connections
  - Patch I/O - tells active connections what is being modulated and how
  - Active Connection - record of connection to allows for canvas reset and redraws

2. Event Driven Architecture
  - each Patch I/O instance has two events available:
    a. patch-connected
    b. patch-disconnected
  - each Active Connection instance has two event available:
    a. connection-created
    b. connection-cleared
  - Only one Rack instance clears and redraw board on every patch change

3. Sound Engine (Not in POC)
  - uses the Javascript Audio API
  - patching the VCO starts playing sound
   
*/

"use client";

import { randomUUID } from "crypto";
import { useLayoutEffect, useRef, useState } from "react";

function log(...args: any) {
	const isInProd = process.env.NODE_ENV === 'production';
	if (isInProd) return;

	console.log('DEBUG', ...args);	
}

class Point extends EventTarget {
	x: number;
	y: number;

  constructor (x: number, y: number) {
  	super();
  	
  	this.x = x;
   	this.y = y;
  }
}

class Patch extends Point {
	radius = 15;
	id: string;
	isInput = false;

	private borderWidth = 5;
	
	static EVENT_TYPE_PATCH_INPUT_SELECTED = 'patch-input-selected';
  static EVENT_TYPE_PATCH_OUTPUT_SELECTED = 'patch-output-selected';
  
	constructor (x: number, y: number, isInput: boolean) {
		super(x, y);

		this.x = x;
		this.y = y;
		this.isInput = isInput;
		this.id = crypto.randomUUID();
	}

	isInsidePatchArea (p: Point) {
		const xAxisDiff = Math.abs(p.x - this.x);
		const yAxisDiff = Math.abs(p.y - this.y);

		return xAxisDiff <= this.radius && yAxisDiff <= this.radius;	
	}
}

interface Connection {
	to?: Patch
	from?: Patch,
	color: string
}

class EurorackCanvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D;

	private currentlyPatchingInput: Patch | null = null;
	private patches: Patch[] = [];
	private connections = new Map<string, Connection>();	;
	private colors = ['red', 'blue', 'yellow', 'green', 'brown', 'grey'];
  private selectedColorIndex = 0;

	constructor (canvas: HTMLCanvasElement, patches: Patch[]){
		this.canvas = canvas;
		const ctx = canvas.getContext('2d');

		if (!ctx) throw new Error('canvas ctx is not available but required');
		this.ctx = ctx;
		this.patches = patches;

		const redraw = this.redraw.bind(this);
		const handleMouseDown = this.handleMouseDown.bind(this);
		const handleMouseUp = this.handleMouseUp.bind(this);
		
		this.canvas.addEventListener('mousedown', function(e) {
			handleMouseDown(e);
			redraw();
		});

		this.canvas.addEventListener('mouseup', function(e) {
			handleMouseUp(e)
			redraw();
		});
		
	}

	private drawPatchIO (p: Patch) {
		const arcStart = 0;
		const arcEnd = 2 * Math.PI;
		this.ctx.lineWidth = 7;
		this.ctx.strokeStyle = p.isInput? 'black' : '#5e5c5c';
		this.ctx.beginPath();
		this.ctx.moveTo(p.x + p.radius, p.y);
		this.ctx.arc(p.x, p.y, p.radius, arcStart, arcEnd);
		this.ctx.fillStyle = "#dbd9d9";
		this.ctx.fill();
		this.ctx.stroke();
	}

	private isCurrentlyPatching () {
		return this.currentlyPatchingInput instanceof Patch;
	}

	private handleMouseDown (e: MouseEvent) {
		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		for (const patch of this.patches) {
			if (!patch.isInput) continue;
			if (!patch.isInsidePatchArea(p)) continue;

			this.connections.delete(patch.id);
			this.selectedColorIndex = this.connections.size % this.colors.length;
			this.currentlyPatchingInput = patch;
			break;
		}
	}

	private handleMouseUp (e: MouseEvent) {
		if (!this.currentlyPatchingInput) return;
		
		const input = this.currentlyPatchingInput;
		this.currentlyPatchingInput = null;
		
		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		for (const patch of this.patches) {
			if (patch.isInput) continue;
			if (!patch.isInsidePatchArea(p)) continue;

			this.selectedColorIndex = this.connections.size % this.colors.length;
			this.connections.set(input.id, {
				from: input,
				to: patch,
				color: this.colors[this.selectedColorIndex]
			});			

			break;
		}
	}

  redraw () {
 		this.ctx.reset();
 		
		for (let i = 0; i < this.patches.length; i++) {
			const patch = this.patches[i]
		  this.drawPatchIO(patch);
	  }

		let i = 0;
		for (const [ _k, connection ] of this.connections.entries()) {
			if (!connection.from || !connection.to) continue;
			this.drawPatch(connection);
			i = (i + 1) % this.colors.length;
		}
	}	

	private drawPatch (connection: Connection) {
		const { from, to } = connection;
		if (!from || !to) throw new Error('connection requires "from" and "to" properties to be set to patches')

		this.ctx.strokeStyle = connection.color;		
		this.ctx.lineWidth = 10;
		this.ctx.beginPath();
	  this.ctx.moveTo(from.x, from.y);
	  this.ctx.lineTo(to.x, to.y);
	  this.ctx.stroke();		
	}
}

export default function Synthesizer() {
	const canvas = useRef<HTMLCanvasElement | null>(null);

 	useLayoutEffect(function () {
 		const { current } = canvas;
		const ctx = current?.getContext("2d");
		if (!current || !ctx) return;

		const patches: Patch[] = [];
		patches.push(new Patch(70, 100, false));
		patches.push(new Patch(70, 50, true));
		patches.push(new Patch(70 + 50, 100, false));
		patches.push(new Patch(70 + 50, 50, true));
		
		const eurorack = new EurorackCanvas(current, patches);
		eurorack.redraw();
	});
			
	return (
	  <div className="synthesizer_container">
	    <noscript>
		    <div>
		      Please enable JavaScript to use the full functionality of this website.
		    </div>
		  </noscript>
		  <div id="synthesizer">
			  <canvas ref={canvas}></canvas>
			  <div className="control_container">
		  	</div>
	    </div>
	  </div>
	);
}
