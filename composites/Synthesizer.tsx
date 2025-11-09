"use client";

import { Cactus_Classical_Serif, Jersey_10 } from "next/font/google";
import { useLayoutEffect, useRef } from "react";

interface Point {
	x: number;
	y: number;
}

interface ConnectionEventData {}

function isWithinCircle (point: Point, circle: Circle) {
	const xAxisDiff = Math.abs(point.x - circle.x);
	const yAxisDiff = Math.abs(point.y - circle.y);
	return xAxisDiff <= circle.r && yAxisDiff <= circle.r;
}

class ActiveConnection extends EventTarget {
	from?: Point
	to?: Point

	constructor () {
		super();
	}

	setFrom (p: Point) {
		this.from = p;
	}

	setTo (p: Point) {
		this.to = p
	  this.dispatchEvent(new CustomEvent<ConnectionEventData>('connected', {
	  	detail: {}
	  }));
	}
	
  drawConnection(ctx: CanvasRenderingContext2D) {
  	if (!this.to || !this.from) return;

		ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
		ctx.beginPath();
    ctx.moveTo(this.from.x, this.from.y);
    ctx.lineTo(this.to.x, this.to.y);
    ctx.stroke();
  }
}

class Circle {
	x: number;
	y: number;
	r: number;
	isInput: boolean;
	id: number;

	constructor( x: number, y: number, r: number, isInput: boolean ) {
		this.x = x;
		this.y = y;
		this.r = r
		this.isInput = isInput;
		this.id = Math.random();
	}

	drawsCircle (ctx: CanvasRenderingContext2D) {
			const arcStart = 0;
			const arcEnd = 2 * Math.PI;
			ctx.lineWidth = 5;
			ctx.strokeStyle = 'black';
			ctx.beginPath();
			ctx.moveTo(this.x + this.r, this.y);
			ctx.arc(this.x, this.y, this.r, arcStart, arcEnd);
			ctx.stroke();
	}

	setupPatchingHandlers (canvas: HTMLCanvasElement, activeConnection: ActiveConnection) {
		let isPatching = false;
	  const thisCircle = this;
	  
		function initPatching (e: MouseEvent) {
			isPatching = true;
			
			if (thisCircle.isInput) return;			
			const clickPoint: Point = {
				x: e.offsetX,
				y: e.offsetY
			}
		
			if (!isWithinCircle(clickPoint, thisCircle)) return;
			activeConnection.setFrom(thisCircle);
		}

		function stopPatching (e: MouseEvent) {
			isPatching = false;
						
			if (!thisCircle.isInput) return;
			const unclickPoint: Point = {
				x: e.offsetX,
				y: e.offsetY
			}

			if (isWithinCircle(unclickPoint, thisCircle)) {
				activeConnection.setTo(thisCircle);
				console.log('patch here', activeConnection)
			}
		}
	
		canvas.addEventListener('mousedown', initPatching);
		canvas.addEventListener('mouseup', stopPatching);
	}
}

export default function Synthesizer() {
	const canvas = useRef<HTMLCanvasElement | null>(null);
	useLayoutEffect(() => {
		if (!canvas?.current) return;
		
		const ctx = canvas?.current?.getContext("2d");
		if (!ctx) return;

		ctx.reset();
		const inputs: Circle[] = [];
		const outputs: Circle[] = [];
		const activeConnection = new ActiveConnection();
		activeConnection.addEventListener('connected', function(e) {
			console.log('connected', e);
			activeConnection.drawConnection(ctx);
		});

		const iCircle = new Circle(25, 25, 10, false);
		iCircle.drawsCircle(ctx);
		iCircle.setupPatchingHandlers(canvas.current, activeConnection);
		
		const oCircle = new Circle(25, 60, 10, true);
		oCircle.drawsCircle(ctx);
		oCircle.setupPatchingHandlers(canvas.current, activeConnection);
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
