"use strict";

var makeAffine = require('./Affine');

var renderWithPathMethod = require('./RenderWithPathMethod');

/**
 * The RenderLineInstance renderer facilitates of a single
 * structure instance, representing edges as straight lines in the disk.
 * 
 * @param  {Structure} 	structure 		a line-generating structure capable of providing a stream of edges to render.
 * @return {d3.selection}           		RenderGrid object with a render : Int x Int -> SVG method.
 */
module.exports = function RenderLineInstance( structure ) {
	if (! (this instanceof RenderLineInstance)) { return new RenderLineInstance( structure ); }
	var self = this;

	/**
	 * The render method takes a target svg, centerpoint, radius, and optional iteration, and renders
	 * the structure to the svg.
	 * 
	 * @param  {d3.selection} svg     a d3 selection to render to
	 * @param  {[Number, Number]} 	center 	the center of the circle to render this loop on.
	 * @param  {Number} radius    	the radius of the circle to render this loop on.
	 * @param  {Number} iteration 	(optional) the iteration of the algorithm.
	 * @return {Renderer}          	self
	 */
	self.render = function( svg, center, radius, iteration ) {

		var affine = makeAffine( structure.radialDivisions(), structure.concentricDivisions(), center, radius );

		return renderWithPathMethod( structure, function( edge ) {
			
				return [
					"M", affine( edge.start())[0], affine( edge.start())[1],
					"L", affine( edge.end())[0], affine( edge.end())[1]
				].join(" ");

		})( svg, center, radius, iteration );		

	};

};