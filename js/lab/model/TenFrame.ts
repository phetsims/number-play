// Copyright 2019-2020, University of Colorado Boulder

/**
 * The model for a DraggableTenFrameNode
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2Property from '../../../../dot/js/Vector2Property.js';
import TenFrameNode from '../../common/view/TenFrameNode.js';
import numberPlay from '../../numberPlay.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

// constants
const SQUARE_SIDE_LENGTH = 60;
const LINE_WIDTH = 1;

class TenFrame {
  public readonly squareSideLength: number;
  public readonly spotCenters: Vector2[];
  public positionProperty: Vector2Property;
  public readonly localBounds: Bounds2;

  constructor( initialPosition: Vector2 ) {

    // @public {number} - the side length of the squares that make up the ten frame
    this.squareSideLength = SQUARE_SIDE_LENGTH;

    // @public {Vector2[]}
    this.spotCenters = TenFrameNode.getSpotCenters( {
      sideLength: SQUARE_SIDE_LENGTH,
      lineWidth: LINE_WIDTH
    } );

    this.localBounds = TenFrameNode.getTenFramePath( {
      sideLength: SQUARE_SIDE_LENGTH,
      lineWidth: LINE_WIDTH
    } ).localBounds;

    // @public {Vector2Property}
    this.positionProperty = new Vector2Property( initialPosition );
  }
}

numberPlay.register( 'TenFrame', TenFrame );
export default TenFrame;