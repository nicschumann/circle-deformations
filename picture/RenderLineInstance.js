"use strict";

var makeAffine = require('./Affine');

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

		var coordinatingClass = function () { return 'path-' + Math.floor( center[0] ) + '-' + Math.floor( center[1] ) + '-' + iteration; };

		var paths = svg.selectAll( '.' + coordinatingClass() ).data( structure.loop() );

		var neighbors = svg.selectAll( '.' + coordinatingClass() + '-neighbor' ).data( structure.loop().map( function(x) { return {edge: x, neighbors: x.neighbors() }; }) );

		neighbors.enter()
			.append('path')
			.classed('neighbor', true)
			.classed('free', function( n ) {
				return n.edge.isFree( structure.loop() );
			})
			.classed('path', true )
			.classed( coordinatingClass() + "-neighbor", true )
			.attr('d', function( n ) {
				return n.neighbors.map( function( edge ) {
					return "M " + affine( edge.start() )[0] + " " + affine( edge.start() )[1] + " L " + affine( edge.end() )[0] + " " + affine( edge.end())[1]; 
				}).join(" ");
			});

		paths.enter()
			.append('path')
			.classed('path', true )
			.classed( coordinatingClass(), true )
			.classed( "free-edge", function( edge )  { return edge.isFree( structure.loop() ); } )
			.attr('d', function( edge ) {
				return [
					"M", affine( edge.start())[0], affine( edge.start())[1],
					"L", affine( edge.end())[0], affine( edge.end())[1]
				].join(" ");
			});

		

	};

};