"use strict";

var shuffle = require('shuffle-array');

var arrayEq = require('array-equal');

/**
 * This generator takes radial and concentric division counts,
 * and returns a constructor for an edge on that grid.
 * 
 * @param  {Number} dR the number of radial divisions to assume.
 * @param  {Number} dC the number of concentric divisions to assume.
 * @return {Number -> Number -> Edge}    A Specialized Edge Constructor.
 */
module.exports = function( dR, dC ) {
	/**
	 * An Edge constructor specialized to the passed
	 * radial and concentric grid structure. 
	 * 
	 * Note that either start[0] === end[0] or start[1] === end[1]. If this
	 * condition is not met, then the specified edge is oblique, rather 
	 * than radial or concentric. Oblique edges are not 
	 * allowed in this instatation of the system.
	 * 
	 * @param {[Number,Number]} start the point this edge starts at.
	 * @param {[Number,Number]} end   the point this edge ends at.
	 */
	return function Edge( start, end ) {
		if ( !(this instanceof Edge)) { return new Edge( start, end ); }
		var self = this;

		/**
		 * get the starting point.
		 * 
		 * @return {[Number, Number]} the point this Edge starts at.
		 */
		self.start = function() { return start; };

		/**
		 * get the ending point.
		 * 
		 * @return {[Number, Number]} the point this Edge ends at.
		 */
		self.end = function() { return end; };

		/**
		 * True if this edge represents a radial edge. Radial edges
		 * are the edges which lie along a radius of the disk.
		 * 
		 * @return {Boolean}
		 */
		self.isRadialEdge = function() { return start[0] === end[0]; };

		/**
		 * True if this edge represents a concentric edge. Concentric edges
		 * are those edges which lie on a concentric circle in the disk.
		 * 
		 * @return {Boolean}
		 */
		self.isConcentricEdge = function() { return start[1] === end[1]; };

		/**
		 * The neighbors routine computes the valid neighbors of this edge.
		 * Radial edges have radial neighbors, concentric edges have concentric neighbors.
		 * 
		 * @return {[Edge]} [description]
		 */
		self.neighbors = function() {
			if ( self.isRadialEdge() ) {

				return [
					new Edge( [(dR + ((start[0] + 1) % dR)) % dR, start[1]], [(dR + ((end[0] + 1) % dR)) % dR, end[1] ]),
					new Edge( [(dR + ((start[0] - 1) % dR)) % dR, start[1]], [(dR + ((end[0] - 1) % dR)) % dR, end[1] ]),
				];

			} else if ( self.isConcentricEdge() ) {

				if ( start[1] === 0 ) {
					return [
						new Edge( [start[0], start[1] + 1], [end[0], end[1] + 1]),
					];

				} else if ( start[1] === dC - 1 ) {
					return [
						new Edge( [start[0], start[1] - 1], [end[0], end[1] - 1]),
					];

				} else {
					return [
						new Edge( [start[0], start[1] + 1], [end[0], end[1] + 1]),
						new Edge( [start[0], start[1] - 1], [end[0], end[1] - 1]),
					];
				}

			}
		};

		/**
		 * True just in case this edge is a Free edges. Free edges
		 * are those edges which, given an existing loop of edges,
		 * have a neighbor that does not intersect any edge.
		 *
		 * Note that this should be a member of loop.
		 * 
		 * @param  {[Edge]}  loop a list of edges to use as a test.
		 * @return {Boolean}  
		 */			
		self.isFree = function( loop ) {
			return self.neighbors().some( function( neighbor ) {
				return loop.every( function( edge ) {
					return !neighbor.intersects( edge );
				});
			});

		};

		/**
		 * Given a set of edges, this routine transforms the loop 
		 * by pulling it continuously into an adjacent position, given by one of its neighbors.
		 * Each call to pull results in a new array with length loop.length + 2,
		 * for the two edges added to ensure continuity.
		 *
		 * Note that this must be a member of loop.
		 * 
		 * @param  {[Edge]} loop the loop to build off of.
		 * @return {[type]}      [description]
		 */
		self.pull = function( loop ) {
			var targets = self.neighbors().filter( function( neighbor ) {
				return loop.every( function( edge ) {
					return !edge.intersects( neighbor );
				});
			});

			if ( targets.length === 0 ) {

				throw new Error("pull called on a pinned edge.");

			} else {
				var target = shuffle( targets )[0];

				return [].concat.apply([], loop.map( function( edge ) {
					if ( self.equals( edge ) ) {

						return [
							new Edge( self.start(), target.start() ),
							target,
							new Edge( target.end(), self.end() )
						];

					} else {
						return [ edge ];
					}
				}));
 
			} 
		};

		/**
		 * Equality comparison for edges.
		 * 
		 * @param  {Edge} other 	the Edge to test against.
		 * @return {Boolean}      
		 */
		self.equals = function ( other ) {
			if (!(other instanceof Edge)) { return false; }

			return 	arrayEq( self.start(), other.start() ) && arrayEq( self.end(), other.end() ) ||
					arrayEq( self.end(), other.start() ) && arrayEq( self.start(), other.end() );

		};

		/**
		 * Lax Equality for edges. True if any points are shared between
		 * this and other.
		 * 
		 * @param  {[type]} other 	the Edge to test against.
		 * @return {Boolean}      
		 */
		self.intersects = function( other ) {
			if ( !(other instanceof Edge)) { return false; }

			return 	arrayEq( self.start(), other.start () ) ||
					arrayEq( self.start(), other.end() ) ||
					arrayEq( self.end(), other.start() ) ||
					arrayEq( self.end(), other.end() );

		};

		/**
		 * Throws an error just in case this edge is neither concentric nor radial.
		 */
		if ( !(this.isConcentricEdge() || this.isRadialEdge()) ) {throw new Error('Edge: Constructed an Oblique Edge.');}
	};
};

