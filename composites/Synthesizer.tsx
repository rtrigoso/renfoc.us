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
	radius = 10;
	id: string;

	private borderWidth = 5;
	private isPatching = false;
  private isInput = false;
	
	static EVENT_TYPE_PATCH_INPUT_SELECTED = 'patch-input-selected';
  static EVENT_TYPE_PATCH_OUTPUT_SELECTED = 'patch-output-selected';
  
	constructor (x: number, y: number, isInput: boolean) {
		super(x, y);

		this.x = x;
		this.y = y;
		this.isInput = isInput;
		this.id = randomUUID();
	}

	private isInsidePatchArea (p: Point) {
		const xAxisDiff = Math.abs(p.x - this.x);
		const yAxisDiff = Math.abs(p.y - this.y);

		return xAxisDiff <= this.radius && yAxisDiff <= this.radius;	
	}

	private handleGrab (e: MouseEvent) {
		if (!this.isInput) return;

		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		if (!this.isInsidePatchArea(p)) return;

		const customEvent = new CustomEvent (Patch.EVENT_TYPE_PATCH_INPUT_SELECTED, {
			detail: {}
		});
		this.dispatchEvent(customEvent);
	}

	private handleDrop (e: MouseEvent) {
		this.isPatching = false;

		if (!this.isInput) return;

		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		if (!this.isInsidePatchArea(p)) return;

		const customEvent = new CustomEvent (Patch.EVENT_TYPE_PATCH_OUTPUT_SELECTED, {
			detail: {}
		});
		this.dispatchEvent(customEvent);
	}

  static AttachPatchesToCanvas (canvas: HTMLCanvasElement, patches: Patch[]) {
  	for (const patch of patches) {
	  	canvas.addEventListener('mousedown', patch.handleGrab.bind(this));
	  	canvas.addEventListener('mouseup', patch.handleDrop.bind(this));
  	}
  }
}

class EurorackCanvas {
	canvas: HTMLCanvasElement;
	ctx: CanvasRenderingContext2D | null;
	colors = ['red', 'blue', 'yellow', 'green', 'brown', 'grey'];
  selectedColorIndex = 0;
  
	constructor (canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
	}

	drawPatchIO (p: Patch) {
		if (!(this.ctx instanceof CanvasRenderingContext2D)) throw new Error('canvas context not available');

		const arcStart = 0;
		const arcEnd = 2 * Math.PI;
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'black';
		this.ctx.beginPath();
		this.ctx.moveTo(p.x + p.radius, p.y);
		this.ctx.arc(p.x, p.y, p.radius, arcStart, arcEnd);
		this.ctx.stroke();
	}

	drawPatch (from: Point, to: Point) {
		if (!(this.ctx instanceof CanvasRenderingContext2D)) throw new Error('canvas context not available');		
		if (!from || !to) throw new Error('connection requires "from" and "to" properties to be set to patches')

		this.ctx.strokeStyle = this.colors[this.selectedColorIndex];
		this.selectedColorIndex = (this.selectedColorIndex + 1) % this.colors.length;
		
		this.ctx.lineWidth = 10;
		this.ctx.beginPath();
	  this.ctx.moveTo(from.x, from.y);
	  this.ctx.lineTo(to.x, to.y);
	  this.ctx.stroke();		
	}
}

interface Connection {
	to?: Patch
	from?: Patch
}

function setup(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  const patches: Patch[] = [];
  const connections = new Map<string, Connection>();	
  const activeConnection: Connection = {};

  function select (p: Patch) {
  	return function (e: Event) {
  		delete activeConnection.from;
  		
  		if (connections.has(p.id)) {
  			connections.delete(p.id);
  			redraw(eurorack);
  		}

  		connections.set(p.id, { from: p });
  		redraw(eurorack);

  		activeConnection.from = p;
  	}
  }

  function drop (p: Patch) {
  	return function (e: Event) {
  		delete activeConnection.to;

			const connection = connections.get(activeConnection?.from?.id || '');
			if (!connection) return;
			
  		const { from } = connection;
  		if (!from) return;
  		
  		connections.set(from.id, {
  			from,
  			to: p
  		});

  		redraw(eurorack);
  	}
  }

  function redraw (eurorack: EurorackCanvas) {
 		ctx.reset();

		for (const patch of patches) {
		  eurorack.drawPatchIO(patch);

			const selectPatchIO = select.bind(this)(patch);
			const dropPatchIO = drop.bind(this)(patch);
			patch.addEventListener(Patch.EVENT_TYPE_PATCH_INPUT_SELECTED, selectPatchIO);
			patch.addEventListener(Patch.EVENT_TYPE_PATCH_OUTPUT_SELECTED, dropPatchIO);
		}

		for (const [ _k, connection ] of connections.entries()) {
			if (!connection.from || !connection.to) continue;
			eurorack.drawPatch(connection.from, connection.to);
		}
 	}

		const eurorack = new EurorackCanvas(canvas);
		patches.push(new Patch(25, 60, true));
		patches.push(new Patch(25, 25, false));

  	redraw (eurorack);
}

export default function Synthesizer() {
	const canvas = useRef<HTMLCanvasElement | null>(null);

 	useLayoutEffect(function () {
 		const { current } = canvas;
		const ctx = current?.getContext("2d");
		if (!current || !ctx) return;

		setup(current, ctx)
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
