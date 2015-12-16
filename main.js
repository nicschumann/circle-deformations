

var Cycle = require( './loop/Cycle' );

var RenderProgression = require( './picture/RenderProgression' );

var RenderSeries = require('./picture/RenderSeries');

/**
 * The number of radial divisions and concentric 
 * divisions to divide our disk into. 
 */
var radialDivisions = 5, concentricDivisions = 15;

/**
 * Set up a cycle to deform.
 */
var cycle = new Cycle( radialDivisions, concentricDivisions );

/**
 * Build a renderer for the cycle
 */
var renderer = new RenderProgression( cycle );

/**
 * Render the cycle according to the
 * selected representation strategy, and 
 * with specified grid and canvas sizes.
 */
renderer

	.canvasWidth( 2250 )

	.canvasHeight( 1350 )

	.gridWidth( 6 )

	.gridHeight( 6 )

	.render();





