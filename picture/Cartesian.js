"use strict";

/**
 * Given radial and concentric divisions, this converts a cell
 * specifying a point in the radio-concentric grid into it's
 * position on the unit disk in cartesian coordinates.
 * 
 * @param  {Number} radialDivisions     the number of radial divisions to use.
 * @param  {Number} concentricDivisions the number of concentric divisions to use.
 * @return {[Number, Number] -> [Number, Number]}   a point on the unit disk.                  
 */
module.exports = function( radialDivisions, concentricDivisions ) {
	return function cartesian( cell ) {

		var modulus 	= cell[0] * (2 * Math.PI / radialDivisions ) + Math.PI / radialDivisions;
		var argument 	= cell[1] * (1 / concentricDivisions) + 1 / (2 * concentricDivisions);

		return [
			argument * Math.cos( modulus ),
			argument * Math.sin( modulus )
		];
	};
};