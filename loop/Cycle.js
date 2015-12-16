"use strict";

var shuffle = require('shuffle-array');

var edgeWith = require('./Edge');

var empty = function ( set ) { return set.length === 0; };

var randomPoint = function ( dR, dC ) {
	return [
		Math.floor( Math.random() * dR ),
		Math.floor( Math.random() * dC ),
	];
};

/**
 * This structure models a continuously deformable loop embedded in a disk.
 * It uses a radial coordinate system to discretize the loop deformations.
 * 
 * @param  {Number} dR      the number of radial divisions for this Cycle
 * @param  {Number} dC      the number of concentric divisions for this Cycle
 * @param  {[Edge]} initial (optional) an initial loop condition to base this cycle off of.
 */
module.exports = function Cycle( dR, dC, initial ) {
	if ( !(this instanceof Cycle)) { return new Cycle( dR, dC, initial ); }
	var self = this;

	var loop = initial || [];

	var Edge = edgeWith( dR, dC );

	/**
	 * Given a point in the circle's grid,
	 * this routine generates the concentric loop
	 * through this point.
	 * 
	 * @param  {[Number,Number]} p  a point in the grid to draw a concentric circle through.
	 * @return {[Edge]}     		the initial loop for the given p
	 */
	self.seed = function( p ) {

		if ( typeof p == "undefined" ) { p = randomPoint( dR, dC ); }

		loop = Array.apply( null, new Array( dR ) ).map( function( _, i ) {

			return new Edge( [(p[0] + i) % dR, p[1] ], [(p[0] + i + 1) % dR, p[1] ] );

		});

		return loop;
		
	};

	/**
	 * This function reduces the loop to the set of free edges inside of it.
	 * An edge is free if it has neighbors which do not intersect any loop
	 * edges.
	 * 
	 * @return {[Edge]} the free edges of the loop.
	 */
	self.freeSet = function( ) {

		return shuffle( loop.filter( function( edge ) { return edge.isFree( loop ); }) );

	};


	/**
	 * This routine selects a free edge to deform.
	 * 
	 * @param  {[Edge]} fromSet (optional) the free set of edges. assumed to be non-empty.
	 * @return {[Edge]}         The new loop state.
	 */
	self.pull = function( fromSet ) {

		fromSet = fromSet || self.freeSet();

		if ( !empty( fromSet ) ) {

			var selected = fromSet[0];

			loop = selected.pull( loop );

		}

		return loop;

	};


	/**
	 * The cover routine attempts to deform the loop int
	 * the largest covering possible, until there are no
	 * further edges free and available.
	 * 
	 * @param  {Number} iterations (optional) the number of iterations after which to give up.
	 * @return {[Edge]}    the deformed loop.        
	 */
	self.cover = function( iterations ) {

		iterations = iterations || Infinity;

		self.seed( randomPoint( dR, dC ) );

		var iteration = 0;

		while ( !empty( self.freeSet() ) && iteration < iterations ) {

			self.pull( );

			iteration += 1;

		}

		return loop;

	};

	/**
	 * Take a snapshot of the current loop in this Cycle.
	 * 		
	 * @return {[Edge]} the current loop.
	 */
	self.loop = function() { return loop; };

	/**
	 * Returns the number of radial divisions built into this cycle.
	 * 
	 * @return {Number}  the number of radial divisions.
	 */
	self.radialDivisions = function() { return dR; };

	/**
	 * Returns the number of concentric divisions built into this cycle.
	 * 
	 * @return {Number}  the number of concentric divisions.
	 */
	self.concentricDivisions = function() { return dC; };

	/**
	 * This routine clones the current cycle, creating an independent copy of it.
	 * Useful for branching off from a given point in the progression.
	 * 
	 * @return {Cycle}   a copy of this.
	 */
	self.clone = function() { return new Cycle( dR, dC, loop ); };

};








