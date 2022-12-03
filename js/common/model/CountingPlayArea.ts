// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers. This file was
 * copied in part from make-a-ten/explore/model/MakeATenExploreModel.js
 * then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingCommonModel from '../../../../counting-common/js/common/model/CountingCommonModel.js';
import CountingObject from '../../../../counting-common/js/common/model/CountingObject.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import TenFrame from '../../lab/model/TenFrame.js';
import Property from '../../../../axon/js/Property.js';

type SelfOptions = {
  tenFrames?: null | ObservableArray<TenFrame>;
};
export type CountingPlayAreaOptions = SelfOptions;
type CreateCountingObjectFromBucketOptions = {
  shouldAnimate?: boolean;
  value?: number;
  remainder?: boolean;
};

// constants
const GROUP_DIVISORS = [ 2, 5, 10 ]; // specified by designer

// the minimum distance that a playObject added to the play area via animation can be to another playObject in the
// play area, in screen coordinates
const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 60;

class CountingPlayArea extends CountingCommonModel {
  private getCountingObjectOrigin: () => Vector2;
  private playAreaBoundsProperty: TReadOnlyProperty<Bounds2>;
  private organizedObjectSpots: Vector2[];
  private initialized: boolean;
  private countingObjectCreatorNodeHeight: number;
  public readonly tenFrames: ObservableArray<TenFrame> | null;
  public readonly groupingEnabledProperty: TReadOnlyProperty<boolean>;

  public constructor( highestCount: number, groupingEnabledProperty: TReadOnlyProperty<boolean>, name: string,
                      providedOptions?: CountingPlayAreaOptions ) {
    super( highestCount, name );

    const options = optionize<CountingPlayAreaOptions, SelfOptions>()( {
      tenFrames: null
    }, providedOptions );

    this.groupingEnabledProperty = groupingEnabledProperty;

    // set later by the view
    this.getCountingObjectOrigin = () => Vector2.ZERO;
    this.countingObjectCreatorNodeHeight = 0;
    this.playAreaBoundsProperty = new Property( new Bounds2( 0, 0, 0, 0 ) );
    this.organizedObjectSpots = [ Vector2.ZERO ];

    // true when this.getCountingObjectOrigin() and this.playAreaBoundsProperty have been set
    this.initialized = false;

    // contains any ten frames that are in the play area
    this.tenFrames = options.tenFrames;

    // when the GroupLinkType is switched to no grouping, break apart any object groups
    this.groupingEnabledProperty.lazyLink( groupingEnabled => {
      !groupingEnabled && this.breakApartCountingObjects( true );
    } );
  }

  /**
   * Setup the origin and bounds needed from the view
   */
  public initialize( getCountingObjectOrigin: () => Vector2, countingObjectCreatorNodeHeight: number,
                     playAreaBoundsProperty: TReadOnlyProperty<Bounds2> ): void {
    assert && assert( !this.initialized, 'CountingPlayArea already initialized' );

    // use a function for getting the paper number origin because its position changes in the view
    this.getCountingObjectOrigin = getCountingObjectOrigin;
    this.countingObjectCreatorNodeHeight = countingObjectCreatorNodeHeight;
    this.playAreaBoundsProperty = playAreaBoundsProperty;
    this.initialized = true;

    this.organizedObjectSpots = this.calculateOrganizedObjectSpots();
  }

  /**
   * Create and randomly position a group of objects whose sum is the current number.
   */
  public createAllObjects( currentNumber: number, setAllObjectsAsGrouped: boolean ): void {
    this.removeAllCountingObjects();
    const objectShouldAnimate = false;

    if ( setAllObjectsAsGrouped ) {
      const divisor = dotRandom.sample( GROUP_DIVISORS );
      const numberOfCards = Math.floor( currentNumber / divisor );
      const remainderCardValue = currentNumber % divisor;

      _.times( numberOfCards, () => {
        this.createCountingObjectFromBucket( {
          shouldAnimate: objectShouldAnimate,
          value: divisor
        } );
      } );

      if ( remainderCardValue ) {
        this.createCountingObjectFromBucket( {
          shouldAnimate: objectShouldAnimate,
          value: remainderCardValue,
          remainder: true
        } );
      }
    }
    else {
      _.times( currentNumber, () => {
        this.createCountingObjectFromBucket( {
          shouldAnimate: objectShouldAnimate
        } );
      } );
    }

    this.calculateTotal();
  }

  /**
   * Creates a countingObject and animates it to a random open place in the play area.
   */
  public createCountingObjectFromBucket( providedOptions?: CreateCountingObjectFromBucketOptions ): void {
    assert && assert( this.initialized, 'createCountingObjectFromBucket called before initialization' );

    const options = optionize<CreateCountingObjectFromBucketOptions>()( {
      shouldAnimate: true,
      value: NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE,
      remainder: false
    }, providedOptions );

    let destinationPosition;
    let findCount = 0;

    const countingObject = new CountingObject( options.value, Vector2.ZERO, {
      groupingEnabledProperty: this.groupingEnabledProperty
    } );
    const origin = this.getCountingObjectOrigin().minus( countingObject.localBounds.center );
    const scale = countingObject.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                  NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
    countingObject.setDestination( origin, false, {
      targetScale: scale
    } );

    // TODO: This is kind of a band-aid to keep the grouped objects' handles from sticking out of the top of the play
    // area since they are not yet included in countingObject.localBounds above without a view created
    const playAreaBoundsMinY = this.groupingEnabledProperty.value ? 30 : 0;

    // NOTE: The calculation below assumes that the countingObjectCreatorNode is positioned along the bottom of the playArea
    // bounds, see positioning in CountingPlayAreaNode
    const playAreaBounds = this.playAreaBoundsProperty.value
      .withMinY( this.playAreaBoundsProperty.value.minY + playAreaBoundsMinY )
      .withMaxY( this.playAreaBoundsProperty.value.maxY - this.countingObjectCreatorNodeHeight );
    const countingObjectOriginBounds = countingObject.getOriginBounds( playAreaBounds );

    // TODO: this algorithm does not take into account paper numbers that are on their way to a spot, and should
    // be rewritten to be better and accommodate that constraint
    // looks for positions that are not overlapping with other playObjects in the play area
    while ( !destinationPosition ) {
      const possibleDestinationX = dotRandom.nextDouble() * ( countingObjectOriginBounds.maxX - countingObjectOriginBounds.minX ) +
                                   countingObjectOriginBounds.minX;
      const possibleDestinationY = dotRandom.nextDouble() * ( countingObjectOriginBounds.maxY - countingObjectOriginBounds.minY ) +
                                   countingObjectOriginBounds.minY;
      const possibleDestinationPoint = new Vector2( possibleDestinationX, possibleDestinationY );
      let spotIsAvailable = true;
      const numberOfCountingObjectsInPlayArea = this.countingObjects.lengthProperty.value;

      // compare the proposed destination to the position of every playObject in the play area. use c-style loop for
      // best performance, since this loop is nested
      for ( let i = 0; i < numberOfCountingObjectsInPlayArea; i++ ) {
        if ( this.countingObjects[ i ].positionProperty.value.distance( possibleDestinationPoint )
             < MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS ) {
          spotIsAvailable = false;
        }
      }

      // bail if taking a while to find a spot. 1000 empirically determined.
      if ( ++findCount > 1000 ) {
        spotIsAvailable = true;
      }
      destinationPosition = spotIsAvailable ? possibleDestinationPoint : null;
    }

    countingObject.setDestination( destinationPosition, options.shouldAnimate, {
      targetScale: NumberPlayConstants.COUNTING_OBJECT_SCALE
    } );
    this.addCountingObject( countingObject );

    this.calculateTotal();
  }

  /**
   * Finds the closest countingObject to their origin and animates it back over the bucket. If only countingObjects with
   * values greater than one exist, break them up and send their components with values of one back.
   * TODO: Rename to something that indicates finding closest paper number to return
   */
  public returnCountingObjectToBucket(): void {
    assert && assert( this.countingObjects.lengthProperty.value > 0, 'countingObjects should exist in play area' );
    assert && assert( this.initialized, 'returnCountingObjectToBucket called before initialization' );

    // sort by not in a ten frame, then by lowest value, then by proximity to the bucket
    const sortedCountingObjects = _.sortBy( this.countingObjects, [
      countingObject => {
        return this.countingObjectContainedByTenFrame( countingObject ) ? 1 : 0;
      },
      countingObject => {
        return countingObject.numberValueProperty.value;
      },
      countingObject => {
        return countingObject.positionProperty.value.distance( this.getCountingObjectOrigin() );
      }
    ] );

    // remove any countingObjects that aren't included in the sum - these are already on their way back to the bucket
    _.remove( sortedCountingObjects, countingObject => {
      return !countingObject.includeInSumProperty.value;
    } );

    let countingObjectToReturn = sortedCountingObjects.shift();
    if ( countingObjectToReturn ) {

      // if the chosen paperNumber has a value greater than 1, break it up by creating a new paperNumber with a value of
      // 1 to return instead
      if ( countingObjectToReturn.numberValueProperty.value > NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE ) {
        const amountRemaining = countingObjectToReturn.numberValueProperty.value - NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE;
        countingObjectToReturn.changeNumber( amountRemaining );

        countingObjectToReturn = new CountingObject(
          NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE,
          countingObjectToReturn.positionProperty.value, {
            groupingEnabledProperty: this.groupingEnabledProperty
          } );
        this.addCountingObject( countingObjectToReturn );
      }

      if ( this.countingObjectContainedByTenFrame( countingObjectToReturn ) ) {
        const tenFrame = this.getContainingTenFrame( countingObjectToReturn );
        tenFrame.removeCountingObject();
      }
      else {
        this.sendCountingObjectToCreatorNode( countingObjectToReturn );
      }
    }
  }

  /**
   * Animates the given countingObject back to its creator node.
   */
  public sendCountingObjectToCreatorNode( countingObject: CountingObject ): void {
    assert && assert( this.countingObjects.lengthProperty.value > 0, 'countingObjects should exist in play area' );
    assert && assert( this.initialized, 'returnCountingObjectToBucket called before initialization' );

    // remove it from counting towards the sum and send it back to its origin. countingObjects aren't removed from the
    // playArea until they get back to the bucket, but we don't want them to count towards the sum while they're on
    // their way to the bucket.
    assert && assert( countingObject.includeInSumProperty.value, 'countingObject already removed from sum' );
    countingObject.includeInSumProperty.value = false;
    this.calculateTotal();

    const origin = this.getCountingObjectOrigin().minus( countingObject.localBounds.center );
    const scale = countingObject.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                  NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;

    countingObject.setDestination( origin, true, {
      targetScale: scale
    } );
  }

  /**
   * Returns true if the provided countingObject is contained by a tenFrame
   */
  private countingObjectContainedByTenFrame( countingObject: CountingObject ): boolean {
    if ( this.tenFrames ) {
      let foundInTenFrame = false;

      this.tenFrames.forEach( tenFrame => {
        if ( tenFrame.countingObjects.includes( countingObject ) ) {
          foundInTenFrame = true;
        }
      } );
      return foundInTenFrame;
    }
    else {
      return false;
    }
  }

  /**
   * Returns the tenFrame that the countingObject is contained by. Should only be called if the countingObject is known to be
   * contained by a tenFrame.
   */
  private getContainingTenFrame( countingObject: CountingObject ): TenFrame {
    assert && assert( this.tenFrames, 'should not be called if there are no ten frames' );

    let containingTenFrame: TenFrame;

    this.tenFrames!.forEach( tenFrame => {
      if ( tenFrame.countingObjects.includes( countingObject ) ) {
        containingTenFrame = tenFrame;
      }
    } );

    assert && assert( containingTenFrame!, 'no containing tenFrame found for countingObject' );

    return containingTenFrame!;
  }

  /**
   * Calculates the spots for organized objects
   */
  private calculateOrganizedObjectSpots(): Vector2[] {
    assert && assert( this.initialized, 'calculateOrganizedObjectSpots called before initialization' );

    const objectWidth = CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.width;
    const objectHeight = CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height;
    const objectMargin = 3;

    const numberOfColumns = 5; // rows
    const numberOfRows = this.sumProperty.range.max / numberOfColumns;

    const xMargin = 88; // empirically determined to center group TODO: figure out why math isn't working for this
    const yMargin = CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;

    const spots = [];

    for ( let i = 0; i < numberOfRows; i++ ) {
      for ( let j = 0; j < numberOfColumns; j++ ) {
        spots.push( new Vector2(
          this.playAreaBoundsProperty.value.minX + xMargin + ( ( objectWidth + objectMargin ) * j ),
          this.playAreaBoundsProperty.value.minY + yMargin + ( ( objectHeight + objectMargin ) * i )
        ) );
      }
    }
    return spots;
  }

  /**
   * Organizes the playObjectsInPlayArea in a grid pattern. Can only be called if this.organizedObjectSpots exist.
   */
  public organizeObjects(): void {

    assert && assert( this.organizedObjectSpots, 'this.organizedObjectSpots must exist to call this function' );

    this.breakApartCountingObjects();

    // copy the current playObjectsInPlayArea so we can mutate it
    let objectsToOrganize = [ ...this.countingObjects ].filter( countingObject => countingObject.includeInSumProperty.value );
    const numberOfObjectsToOrganize = objectsToOrganize.length;

    for ( let i = 0; i < numberOfObjectsToOrganize; i++ ) {
      const destination = this.organizedObjectSpots[ i ];

      // sort the  playObjectToOrganize by closest to the destination
      objectsToOrganize = _.sortBy( objectsToOrganize, object => {
        return object.positionProperty.value.distance( destination );
      } );
      const objectToOrganize = objectsToOrganize.shift();

      objectToOrganize && objectToOrganize.setDestination( destination, true, {
        targetScale: NumberPlayConstants.COUNTING_OBJECT_SCALE
      } );
    }
  }

  /**
   * Breaks apart all counting objects into counting objects with a value of 1. By default, it creates all new counting
   * objects in the position of the original counting object. If stack=true, it arranges them according to the
   * background shape of the original counting object.
   */
  public breakApartCountingObjects( stack = false ): void {

    // TODO: cleanup and doc

    const objectsToBreakDown = [ ...this.countingObjects ];

    objectsToBreakDown.forEach( countingObject => {
      if ( countingObject.numberValueProperty.value > 1 ) {
        const countingObjectPosition = countingObject.positionProperty.value;
        const countingObjectValue = countingObject.numberValueProperty.value;

        const numberOfSets = countingObjectValue < NumberPlayConstants.TEN ? 1 : 2;
        const numberOfRows = NumberPlayConstants.TEN;

        const origin = stack ? countingObjectPosition.minusXY( 0, 25 ) : countingObjectPosition;
        const offsetYSegment = stack ? ( countingObject.localBounds.height - CountingCommonConstants.PLAY_OBJECT_SIZE.height ) /
                                       ( numberOfRows + 1 ) : 0;
        let offsetY = 0;

        let reAddedCountingObjects = 0;
        const xShift = countingObjectValue >= NumberPlayConstants.TEN && stack ? -CountingCommonConstants.PLAY_OBJECT_SIZE.width : 0;

        this.removeCountingObject( countingObject );

        for ( let i = numberOfSets - 1; i >= 0; i-- ) {
          for ( let j = 0; j < numberOfRows; j++ ) {
            if ( reAddedCountingObjects < countingObjectValue ) {
              const newCountingObject = new CountingObject( 1, origin.plusXY( i * xShift, offsetY ), {
                groupingEnabledProperty: this.groupingEnabledProperty
              } );
              this.addCountingObject( newCountingObject );
              offsetY += offsetYSegment;
              reAddedCountingObjects++;
            }
          }
          offsetY = 0;
        }
      }
    } );
  }
}

numberPlay.register( 'CountingPlayArea', CountingPlayArea );
export default CountingPlayArea;
