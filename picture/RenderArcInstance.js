"use strict";

var makeAffine = require('./Affine');

var renderWithPathMethod = require('./RenderWithPathMethod');

function clockwise( t1, t2 ) {
	return Math.sin( t2 - t1 ) > 0;
}

/**
 * The RenderLineInstance renderer facilitates of a single
 * structure instance, representing edges as straight lines in the disk.
 * 
 * @param  {Structure} 	structure 		a line-generating structure capable of providing a stream of edges to render.
 * @return {d3.selection}           		RenderGrid object with a render : Int x Int -> SVG method.
 */
module.exports = function RenderArcInstance( structure ) {
	if ( !(this instanceof RenderArcInstance)) { return new RenderArcInstance( structure ); }
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

				if ( edge.isConcentricEdge() ) {

					var r = radius * (edge.start()[1] * (1 / structure.concentricDivisions()) + 1 / (2 * structure.concentricDivisions()));

					var theta1 = edge.start()[0] * (2 * Math.PI / structure.radialDivisions() ) + Math.PI / structure.radialDivisions();
					var theta2 = edge.end()[0] * (2 * Math.PI / structure.radialDivisions() ) + Math.PI / structure.radialDivisions();

					return [
						"M", affine( edge.start())[0], affine( edge.start())[1],
						"A", r,  r, theta1, 0, clockwise( theta1, theta2 ) ? 1 : 0, affine( edge.end())[0], affine( edge.end())[1]
					].join(" ");
	

				} else if ( edge.isRadialEdge() ) {

					return [
						"M", affine( edge.start())[0], affine( edge.start())[1],
						"L", affine( edge.end())[0], affine( edge.end())[1]
					].join(" ");

				}
				
		})( svg, center, radius, iteration );


	};
};



