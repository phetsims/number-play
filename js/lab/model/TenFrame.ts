// Copyright 2019-2022, University of Colorado Boulder

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
import Range from '../../../../dot/js/Range.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';

// constants
const SQUARE_SIDE_LENGTH = 60;
const LINE_WIDTH = 1;
const NUMBER_OF_SPOTS = 10;

class TenFrame {

  public readonly countingObjects: ObservableArray<PaperNumber>;
  public readonly spotCenters: Vector2[];
  public positionProperty: Vector2Property;
  public readonly scaleProperty: NumberProperty;
  public readonly localBounds: Bounds2;

  // the side length of the squares that make up the ten frame
  public static readonly SQUARE_SIDE_LENGTH = SQUARE_SIDE_LENGTH;

  public constructor( initialPosition: Vector2 ) {

    this.countingObjects = createObservableArray();

    this.spotCenters = TenFrameNode.getSpotCenters( {
      sideLength: SQUARE_SIDE_LENGTH,
      lineWidth: LINE_WIDTH
    } );

    this.localBounds = TenFrameNode.getTenFramePath( {
      sideLength: SQUARE_SIDE_LENGTH,
      lineWidth: LINE_WIDTH
    } ).localBounds;

    this.positionProperty = new Vector2Property( initialPosition );
    this.scaleProperty = new NumberProperty( 1, {
      range: new Range( 0, 1 )
    } );
  }

  public tryToAddCountingObject( countingObject: PaperNumber ): void {
    assert && assert( !this.containsCountingObject( countingObject ) );

    if ( this.countingObjects.length < NUMBER_OF_SPOTS ) {
      this.countingObjects.add( countingObject );
    }
  }

  public removeCountingObject(): void {
    this.countingObjects.pop();
  }

  public containsCountingObject( countingObject: PaperNumber ): boolean {
    return this.countingObjects.includes( countingObject );
  }
}

numberPlay.register( 'TenFrame', TenFrame );
export default TenFrame;