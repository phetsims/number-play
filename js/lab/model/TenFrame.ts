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
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';

// constants
const SQUARE_SIDE_LENGTH = 60;
const LINE_WIDTH = 1;
const NUMBER_OF_SPOTS = 10;

class TenFrame {
  public readonly countingObjects: ObservableArray<PaperNumber>;
  public readonly spotCenters: Vector2[];
  public readonly positionProperty: Vector2Property;
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

  /**
   * Sends the provided countingObject outside the nearest border of this ten frame
   */
  public pushAwayCountingObject( countingObject: PaperNumber, playAreaBounds: Bounds2 ): void {

    // bounds of this tenFrame with respect to the center of the provided countingObject
    const globalBounds = this.localBounds.shifted( this.positionProperty.value )
      .shiftedXY( -countingObject.localBounds.center.x, -countingObject.localBounds.center.y );
    const countingObjectPosition = countingObject.positionProperty.value;

    assert && assert( globalBounds.containsPoint( countingObjectPosition ),
      'attempted to push away countingObject that was not over ten frame' );

    // find the distance to the potential destination spot for every side of the tenFrame
    const margin = 10;
    const leftDistanceVector = new Vector2( globalBounds.left - countingObjectPosition.x - countingObject.localBounds.width / 2 - margin, 0 );
    const topDistanceVector = new Vector2( 0, globalBounds.top - countingObjectPosition.y - countingObject.localBounds.height / 2 - margin );
    const rightDistanceVector = new Vector2( globalBounds.right - countingObjectPosition.x + countingObject.localBounds.width / 2 + margin, 0 );
    const bottomDistanceVector = new Vector2( 0, globalBounds.bottom - countingObjectPosition.y + countingObject.localBounds.height / 2 + margin );

    // find which distance is the shortest
    let minimumDistance = Math.abs( leftDistanceVector.x );
    let minimumVector = leftDistanceVector;
    const topDistance = Math.abs( topDistanceVector.y );
    if ( topDistance < minimumDistance ) {
      minimumDistance = topDistance;
      minimumVector = topDistanceVector;
    }
    if ( rightDistanceVector.x < minimumDistance ) {
      minimumDistance = rightDistanceVector.x;
      minimumVector = rightDistanceVector;
    }
    if ( bottomDistanceVector.y < minimumDistance ) {
      minimumDistance = bottomDistanceVector.y;
      minimumVector = bottomDistanceVector;
    }

    // send the countingObject to the closest destination
    const destination = countingObjectPosition.plus( minimumVector );
    countingObject.setConstrainedDestination( playAreaBounds, destination, true );
  }

  public removeCountingObject(): void {
    this.countingObjects.pop();
  }

  public containsCountingObject( countingObject: PaperNumber ): boolean {
    return this.countingObjects.includes( countingObject );
  }

  /**
   * Determine how this ten frame's origin can be placed in the provided bounds.
   */
  public getOriginBounds( viewBounds: Bounds2 ): Bounds2 {
    return new Bounds2(
      viewBounds.left - this.localBounds.left,
      viewBounds.top - this.localBounds.top,
      viewBounds.right - this.localBounds.right,
      viewBounds.bottom - this.localBounds.bottom
    ).eroded( CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN );
  }

  /**
   * If this ten frame outside the available view bounds, move in inside those bounds.
   */
  public setConstrainedDestination( viewBounds: Bounds2, newDestination: Vector2 ): void {
    const originBounds = this.getOriginBounds( viewBounds );
    this.positionProperty.value = originBounds.closestPointTo( newDestination );
  }

  /**
   * Calculates the position of the given paper number in the ten frame based on its index in the array
   */
  public getCountingObjectSpot( countingObject: PaperNumber ): Vector2 {
    const countingObjectSpotLocalPosition = this.spotCenters[ this.countingObjects.indexOf( countingObject ) ];
    const countingObjectSpotCenter = this.positionProperty.value.plus( countingObjectSpotLocalPosition );

    const countingObjectOffset = countingObject.localBounds.center;
    return countingObjectSpotCenter.minus( countingObjectOffset );
  }
}

numberPlay.register( 'TenFrame', TenFrame );
export default TenFrame;