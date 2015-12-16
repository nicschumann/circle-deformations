"use strict";

var d3 = require('d3');

var RenderGrid = require('./RenderGrid');

/**
 * The RenderProgression renderer takes a given cycle
 * and visualizes its defomation algorithm
 * 
 * @param  {Cycle} 	cycle 	A cycle to deform
 * @return {Renderer}      		Renderer
 */
module.exports = function RenderProgression( cycle ) {
	if ( !( this instanceof RenderProgression ) ) { return new RenderProgression( cycle ); }

	var self = this;

	var canvasWidth = 1000, canvasHeight = 1000, width = 5, height = 5;

	/**
	 * Set the canvas width
	 * 
	 * @param  {Number} 	w  	the width of the canvas to render
	 * @return {Renderer}   	self
	 */
	self.canvasWidth = function( w ) {
		canvasWidth = w;

		return self;
	};

	/**
	 * Set the canvas width
	 * 
	 * @param  {Number} 	j  	the height of the canvas to render
	 * @return {Renderer}   	self
	 */
	self.canvasHeight = function( h ) {
		canvasHeight = h;

		return self;
	};

	/**
	 * Set the canvas width
	 * 
	 * @param  {Number} 	w  	the width of the grid to render
	 * @return {Renderer}   	self
	 */
	self.gridWidth = function( w ) {
		width = w;

		return self;
	};

	/**
	 * Set the grid height
	 * 
	 * @param  {Number} 	h  	the height of the grid to render.
	 * @return {Renderer}   	self
	 */
	self.gridHeight = function( h ) {
		height = h;

		return self;
	};

	/**
	 * The render function builds a grid renderer, and dispatches 
	 * a sequence of actions to it. At each step, it pulls the passed
	 * cycle once, and sets that step of the deformation to render.
	 * 
	 * @return {Renderer} self
	 */
	self.render = function() {
		var svg = d3.select( document.body ).append('svg')
			 	.attr('width', window.innerWidth )
				.attr('height', window.innerHeight );

		cycle.seed();

		var renderer = new RenderGrid(

			Array.apply( [], new Array( width * height ) ).map( function(  ) {

				var current = cycle.clone();

				cycle.pull();

				return current;

			}) 

		).width( width ).height( height );

		renderer.render( svg, canvasWidth, canvasHeight );

		return self;

	};


}