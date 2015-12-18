"use strict";

var d3 = require('d3');

var RenderInstance = require('./RenderArcInstance');

/**
 * The RenderGrid renderer facilitates rendering a series of 
 * instances of a given line-generating algorithm. 
 * 
 * @param  {Cycle} 	structure 		a line-generating structure capable of providing a stream of edges to render.
 * @return {d3.selection}           		RenderGrid object with a render : Int x Int -> SVG method.
 */
module.exports = function CartesianRenderGrid( structures ) {
	if (! (this instanceof CartesianRenderGrid)) { return new CartesianRenderGrid( structures ); }
	var self = this;


	var width = 5, height = 5, padding = 0;

	/**
	 * Set the unit width of the grid.
	 * 
	 * @param  {Number} p the width to set.
	 * @return {Renderer}  self
	 */
	self.width = function( x ) { width = x; return self; };


	/**
	 * Set the unit height of the grid.
	 * 
	 * @param  {Number} p the height to set.
	 * @return {Renderer}  self
	 */
	self.height = function( y ) { height = y; return self; };


	/**
	 * Set the padding between grid elements.
	 * 
	 * @param  {Number} p the padding to set.
	 * @return {Renderer}  self
	 */
	self.padding = function( p ) { padding = p; return self; };


	/**
	 * Given an svg and desired canvas space, this render lays out a sequence of
	 * cycles in an optimal grid inside of the given space.
	 * 
	 * @param  {d3.selection} svg          an SVG selection to render onto.
	 * @param  {Number} canvasWidth  the width, in pixels, of the desired canvas.
	 * @param  {Number} canvasHeight the heigh, in pixels, of the desired canvas.
	 * @return {Renderer}              self
	 */
	self.render = function( svg, canvasWidth, canvasHeight ) {

		var radius = d3.min([canvasWidth,canvasHeight]) / d3.max([width, height]) / 2 - padding;

		Array.apply( [], new Array( structures.length ) ).map( function( _, index )  {

			var center = [
				canvasWidth * ( 1 / width * Math.floor( index / height ) + 1 / (2*width) ),
				canvasHeight * ( 1 / height * (index % height) + 1 / (2*height) )
			];

			(new RenderInstance( structures[ index ] )).render( svg, center, radius, index );


		});

		return self;

	};

};