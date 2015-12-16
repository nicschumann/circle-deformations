"use strict";

var makeCartesian = require( './Cartesian' );

/**
 * This factory creates specific affine transformations.
 * given an origin point it transforms a point in the unit disk
 * to a corresponding point in the disk centered at the given
 * point and of radius the given radius. The passed radial and
 * concentric divisions are used by the underlying cartesian
 * conversion, to convert the radio-concentric grid indices to
 * polar coordinates on the unit disk.
 * 
 * @param  {Number} radialDivisions     the number of radial divisions to build for
 * @param  {Number} concentricDivisions the number of concentric divisions to build for
 * @param  {[Number, Number]} center   the point to use as the affine translation.    
 * @param  {Number} radius              the radius of the disk centered at center
 * @return {[Number, Number] -> [Number, Number]}  	the corresponding affine transformation.
 */
module.exports = function( radialDivisions, concentricDivisions, center, radius ) {
	var cartesian = makeCartesian( radialDivisions, concentricDivisions );

	return function affine( cell ) {
		return [
			center[0] + radius * cartesian( cell )[0],
			center[1] + radius * cartesian( cell )[1]
		];
	};
};