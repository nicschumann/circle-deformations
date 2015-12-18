"use strict";


/**
 * The RenderWithPathMethod routine encapsulates the D3 dom manipulation,
 * Given a function which returns a wellformed SVG path string given an edge,
 * this routine calls that method on the neighbors and edges in the structure's loop.
 * 
 * @param  {Cycle} structure [description]
 * @param  {Edge -> String} path      [description]
 * @return {d3.selection x [Number, Number] x Number x Integer -> ()}         path rendering function.
 */
module.exports = function RenderWithPathMethod( structure, path ) {

	return function ( svg, center, radius, iteration ) {

		var coordinatingClass = function () { return 'path-' + Math.floor( center[0] ) + '-' + Math.floor( center[1] ) + '-' + iteration; };

		var paths = svg.selectAll( '.' + coordinatingClass() ).data( structure.loop() );

		var neighbors = svg.selectAll( '.' + coordinatingClass() + '-neighbor' ).data( structure.loop().map( function(x) { return {edge: x, neighbors: x.neighbors().filter( function( e ) { return e.isFree( structure.loop() ); }) }; }) );

		neighbors.enter()
			.append('path')
			.classed('neighbor', true)
			.classed('free', function( n ) {
				return n.edge.isFree( structure.loop() );
			})
			.classed('path', true )
			.classed( coordinatingClass() + "-neighbor", true )
			.attr('d', function( n ) {
				return n.neighbors.map( path ).join(" ");			 	
			});

		paths.enter()
			.append('path')
			.classed('path', true )
			.classed( coordinatingClass(), true )
			.classed( "free-edge", function( edge )  { return edge.isFree( structure.loop() ); } )
			.attr('d', path );
	};

};