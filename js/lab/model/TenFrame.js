// Copyright 2019, University of Colorado Boulder

/**
 * The model information for a DraggableTenFrameNode
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const TenFrameNode = require( 'NUMBER_PLAY/common/view/TenFrameNode' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class TenFrame {

    /**
     * @param {number} sideLength - see doc below
     * @param {Vector2} initialPosition
     */
    constructor( squareSideLength, initialPosition ) {

      // @public {number} - the side length of the squares that make up the ten frame
      this.squareSideLength = squareSideLength;

      // @public {Vector2[]}
      this.spotCenters = TenFrameNode.getSpotCenters( {
        sideLength: squareSideLength
      } );

      // @public {Vector2Property}
      this.positionProperty = new Vector2Property( initialPosition );
    }
  }

  return numberPlay.register( 'TenFrame', TenFrame );
} );