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
	radius = 10;
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

	private isInsidePatchArea (p: Point) {
		const xAxisDiff = Math.abs(p.x - this.x);
		const yAxisDiff = Math.abs(p.y - this.y);

		return xAxisDiff <= this.radius && yAxisDiff <= this.radius;	
	}

	handleGrab (e: MouseEvent) {
		if (!this.isInput) return;
		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		if (!this.isInsidePatchArea(p)) return;
		log(`line 81`, this.id);
		const customEvent = new CustomEvent (Patch.EVENT_TYPE_PATCH_INPUT_SELECTED, {
			detail: {}
		});
		this.dispatchEvent(customEvent);
	}

	handleDrop (e: MouseEvent) {
		if (!this.isInput) return;

		const { offsetX: x, offsetY: y } = e;
		const p = new Point(x, y);

		if (!this.isInsidePatchArea(p)) return;
		log(`line 89`, this.id);

		const customEvent = new CustomEvent (Patch.EVENT_TYPE_PATCH_OUTPUT_SELECTED, {
			detail: {}
		});
		this.dispatchEvent(customEvent);
	}
}

interface Connection {
	to?: Patch
	from?: Patch
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
	}

	private drawPatchIO (p: Patch) {
		const arcStart = 0;
		const arcEnd = 2 * Math.PI;
		this.ctx.lineWidth = 5;
		this.ctx.strokeStyle = 'black';
		this.ctx.beginPath();
		this.ctx.moveTo(p.x + p.radius, p.y);
		this.ctx.arc(p.x, p.y, p.radius, arcStart, arcEnd);
		this.ctx.stroke();
	}

	private isCurrentlyPatching () {
		return this.currentlyPatchingInput instanceof Patch;
	}

	private clearActiveConnection () {
		this.currentlyPatchingInput = null;
	}

	private deleteFromConnectionsById (id: string) {
		if (!this.connections.has(id)) return;
		this.connections.delete(id);
		this.redraw();
	}

	private addNewConnection(input: Patch) {
		this.connections.set(input.id, {
			from: input
		});
		this.redraw();
	}

	private updateConnection(output: Patch) {
		const { currentlyPatchingInput: input } = this;
		if (!input) return;

		this.connections.set(input.id, {
			from: input,
			to: output
		})

		this.redraw();
	}

	private setCurrentlyPatchingInput (patch: Patch) {
		this.currentlyPatchingInput = patch;
	}

	private getConnection (id: string) {
		return this.connections.get(id);
	}

  redraw () {
 		this.ctx.reset();
		this.canvas.removeEventListener('mousedown');
		this.canvas.removeEventListener('mouseup');
 		
		for (let i = 0; i < this.patches.length; i++) {
			const patch = this.patches[i]
		  this.drawPatchIO(patch);

			const clearActiveConnection = this.clearActiveConnection.bind(this);
			const deleteFromConnectionsIfFound = this.deleteFromConnectionsById.bind(this, patch.id);
			const addToConnections = this.addNewConnection.bind(this, patch);
			const selectPatchToConnect = this.setCurrentlyPatchingInput.bind(this, patch);		
			const getConnection = this.getConnection.bind(this, patch.id)
			const completeConnection = this.updateConnection.bind(this, patch);
			const isCurrentlyPatching = this.isCurrentlyPatching.bind(this);
			const handleDrop = patch.handleDrop.bind(patch);
			const handleGrab = patch.handleGrab.bind(patch);
			
		  if (patch.isInput) this.canvas.addEventListener('mousedown', function(e) {
		  	log('line 199', this)
		  	handleGrab(e);
		  });
		  if (!patch.isInput) this.canvas.addEventListener('mouseup', function (e) {
		  	handleDrop(e);
		  	clearActiveConnection();
		  });

			patch.addEventListener(Patch.EVENT_TYPE_PATCH_INPUT_SELECTED, function (e) {
				console.log('started connection');
	  		clearActiveConnection();
  		  deleteFromConnectionsIfFound();
				addToConnections();
	  		selectPatchToConnect();
			});

			patch.addEventListener(Patch.EVENT_TYPE_PATCH_OUTPUT_SELECTED, function (e) {
				log('completed connection');
				if (!isCurrentlyPatching) return;
				
  			const connection = getConnection();
  			if (!connection) return;
		
  			const { from } = connection;
  			if (!from) return;

  			completeConnection();
			});
		}

		for (const [ _k, connection ] of this.connections.entries()) {
			if (!connection.from || !connection.to) continue;
			this.drawPatch(connection.from, connection.to);
		}
	}	

	private drawPatch (from: Point, to: Point) {
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

export default function Synthesizer() {
	const canvas = useRef<HTMLCanvasElement | null>(null);

 	useLayoutEffect(function () {
 		const { current } = canvas;
		const ctx = current?.getContext("2d");
		if (!current || !ctx) return;

		const patches: Patch[] = [
			new Patch(25, 60, true),
			new Patch(25, 25, false)
		]
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
