// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers. This file was
 * copied in part from make-a-ten/explore/model/MakeATenExploreModel.js
 * then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingCommonModel from '../../../../counting-common/js/common/model/CountingCommonModel.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Range from '../../../../dot/js/Range.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

// types
type OnesPlayAreaOptions = {
  isResettingProperty: null | BooleanProperty;
  sumPropertyRange: null | Range;
  setAllObjects: boolean;
};
type CreatePaperNumberFromBucketOptions = {
  shouldAnimate: boolean;
  value: number;
  remainder: boolean;
};

// constants
const GROUP_DIVISORS = [ 2, 5, 10 ]; // specified by designer

// the minimum distance that a playObject added to the play area via animation can be to another playObject in the
// play area, in screen coordinates
const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 60;

class OnesPlayArea extends CountingCommonModel {
  public currentNumberProperty: NumberProperty;
  private getPaperNumberOrigin: () => Vector2;
  private playAreaBounds: Bounds2;
  public sumProperty: NumberProperty;
  public isControllingCurrentNumber: boolean;
  private organizedObjectSpots: Vector2[];
  private initialized: boolean;
  private countingCreatorNodeTop: number;
  public readonly groupingEnabledProperty: IReadOnlyProperty<boolean>;

  constructor( currentNumberProperty: NumberProperty,
               groupingEnabledProperty: IReadOnlyProperty<boolean>,
               providedOptions: Partial<OnesPlayAreaOptions> ) {
    super();

    const options = merge( {
      isResettingProperty: null,

      // TODO: remaining options need doc/work
      sumPropertyRange: null,
      setAllObjects: false
    }, providedOptions ) as OnesPlayAreaOptions;

    assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

    this.currentNumberProperty = currentNumberProperty;
    this.groupingEnabledProperty = groupingEnabledProperty;

    // set later by the view
    this.getPaperNumberOrigin = () => Vector2.ZERO;
    this.countingCreatorNodeTop = 0;
    this.playAreaBounds = new Bounds2( 0, 0, 0, 0 );
    this.organizedObjectSpots = [ Vector2.ZERO ];

    // true when this.getPaperNumberOrigin() and this.playAreaBounds have been set
    this.initialized = false;

    // The total sum of the current numbers
    this.sumProperty = new NumberProperty( currentNumberProperty.range!.min, {
      range: options.sumPropertyRange || currentNumberProperty.range
    } );

    // @private {Function} - To be called when we need to recalculate the total
    const calculateTotalListener = this.calculateTotal.bind( this );

    this.paperNumbers.lengthProperty.link( calculateTotalListener );

    // Listen to number changes of paper numbers
    this.paperNumbers.addItemAddedListener( ( paperNumber: PaperNumber ) => {
      paperNumber.numberValueProperty.link( calculateTotalListener );
    } );
    this.paperNumbers.addItemRemovedListener( ( paperNumber: PaperNumber ) => {
      paperNumber.numberValueProperty.unlink( calculateTotalListener );
    } );

    // whether the view of this play area is controlling the current number
    this.isControllingCurrentNumber = false;

    // if the current number changes, add or remove paperNumbers from the play area
    currentNumberProperty.lazyLink( ( currentNumber, previousNumber ) => {
      if ( options.isResettingProperty && !options.isResettingProperty.value &&
           !this.isControllingCurrentNumber && !options.setAllObjects ) {
        if ( !previousNumber ) { // TODO-TS: this is bad, fix this link
          previousNumber = 0;
        }
        if ( currentNumber < previousNumber ) {
          _.times( previousNumber - currentNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.sumProperty.value > currentNumberProperty.range!.min ) {
              this.returnPaperNumberToBucket();
            }
          } );
        }
        else if ( currentNumber > previousNumber ) {
          _.times( currentNumber - previousNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.sumProperty.value < currentNumberProperty.range!.max ) {
              this.createPaperNumberFromBucket();
            }
          } );
        }
      }
    } );

    // when the GroupLinkType is switched to no grouping, break apart any object groups
    this.groupingEnabledProperty.lazyLink( groupingEnabled => {
      !groupingEnabled && this.breakApartCountingObjects( true );
    } );
  }

  /**
   * Setup the origin and bounds needed from the view
   */
  public initialize( getPaperNumberOrigin: () => Vector2, countingCreatorNodeTop: number, playAreaBounds: Bounds2 ): void {
    assert && assert( this.initialized === false, 'OnesPlayArea already initialized' );

    // use a function for getting the paper number origin because its position changes in the view
    this.getPaperNumberOrigin = getPaperNumberOrigin;
    this.countingCreatorNodeTop = countingCreatorNodeTop;
    this.playAreaBounds = playAreaBounds;
    this.initialized = true;

    this.organizedObjectSpots = this.calculateOrganizedObjectSpots();
  }

  /**
   * Create and randomly position a group of objects whose sum is the current number.
   */
  public createAllObjects( currentNumber: number, setAllObjectsAsGrouped: boolean ) {
    this.removeAllPaperNumbers();
    const objectShouldAnimate = false;

    if ( setAllObjectsAsGrouped ) {
      const divisor = dotRandom.sample( GROUP_DIVISORS );
      const numberOfCards = Math.floor( currentNumber / divisor );
      const remainderCardValue = currentNumber % divisor;

      _.times( numberOfCards, () => {
        this.createPaperNumberFromBucket( {
          shouldAnimate: objectShouldAnimate,
          value: divisor
        } );
      } );

      if ( remainderCardValue ) {
        this.createPaperNumberFromBucket( {
          shouldAnimate: objectShouldAnimate,
          value: remainderCardValue,
          remainder: true
        } );
      }
    }
    else {
      _.times( currentNumber, () => {
        this.createPaperNumberFromBucket( {
          shouldAnimate: objectShouldAnimate
        } );
      } );
    }
  }

  /**
   * Creates a paperNumber and animates it to a random open place in the play area.
   */
  private createPaperNumberFromBucket( providedOptions?: Partial<CreatePaperNumberFromBucketOptions> ) {
    assert && assert( this.initialized === true, 'createPaperNumberFromBucket called before initialization' );

    const options = merge( {
      shouldAnimate: true,
      value: NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE,
      remainder: false
    }, providedOptions ) as CreatePaperNumberFromBucketOptions;

    let destinationPosition;
    let findCount = 0;

    const paperNumber = new PaperNumber( options.value, Vector2.ZERO, {
      groupingEnabledProperty: this.groupingEnabledProperty
    } );
    const origin = this.getPaperNumberOrigin().minus( paperNumber.localBounds.center );
    const scale = paperNumber.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                  NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
    paperNumber.setDestination( origin, false, scale );

    // TODO: This is kind of a band-aid to keep the grouped objects' handles from sticking out of the top of the play
    // area since they are not yet included in paperNumber.localBounds above without a view created
    const playAreaBoundsMinY = this.groupingEnabledProperty.value ? 30 : 0;
    const playAreaBounds = this.playAreaBounds.withMinY( playAreaBoundsMinY ).withMaxY( this.countingCreatorNodeTop );
    const paperNumberOriginBounds = paperNumber.getOriginBounds( playAreaBounds );

    // TODO: this algorithm does not take into account paper numbers that are on their way to a spot, and should
    // be rewritten to be better and accommodate that constraint
    // looks for positions that are not overlapping with other playObjects in the play area
    while ( !destinationPosition ) {
      const possibleDestinationX = dotRandom.nextDouble() * ( paperNumberOriginBounds.maxX - paperNumberOriginBounds.minX ) +
                                   paperNumberOriginBounds.minX;
      const possibleDestinationY = dotRandom.nextDouble() * ( paperNumberOriginBounds.maxY - paperNumberOriginBounds.minY ) +
                                   paperNumberOriginBounds.minY;
      const possibleDestinationPoint = new Vector2( possibleDestinationX, possibleDestinationY );
      let spotIsAvailable = true;
      const numberOfPaperNumbersInPlayArea = this.paperNumbers.lengthProperty.value;

      // compare the proposed destination to the position of every playObject in the play area. use c-style loop for
      // best performance, since this loop is nested
      for ( let i = 0; i < numberOfPaperNumbersInPlayArea; i++ ) {
        if ( this.paperNumbers[ i ].positionProperty.value.distance( possibleDestinationPoint )
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

    paperNumber.setDestination( destinationPosition, options.shouldAnimate, NumberPlayConstants.COUNTING_OBJECT_SCALE );
    this.addPaperNumber( paperNumber );
  }

  /**
   * Finds the closest paperNumber to their origin and animates it back over the bucket. If only paperNumbers with
   * values greater than one exist, break them up and send their components with values of one back.
   */
  private returnPaperNumberToBucket() {
    assert && assert( this.paperNumbers.lengthProperty.value > 0, 'paperNumbers should exist in play area' );
    assert && assert( this.initialized === true, 'returnPaperNumberToBucket called before initialization' );

    // sort by lowest value first, then by proximity to the bucket
    const sortedPaperNumbers = _.sortBy( this.paperNumbers, [
      paperNumber => {
        return paperNumber.numberValueProperty.value;
      },
      paperNumber => {
        return paperNumber.positionProperty.value.distance( this.getPaperNumberOrigin() );
      }
    ] );

    // remove any paperNumbers with a value of 0 - these are already on their way back to the bucket
    _.remove( sortedPaperNumbers, paperNumber => {
      return paperNumber.numberValueProperty.value === 0;
    } );

    let paperNumberToReturn = sortedPaperNumbers.shift();
    if ( paperNumberToReturn ) {

      // if the chosen paperNumber has a value greater than 1, break it up by creating a new paperNumber with a value of
      // 1 to return instead
      if ( paperNumberToReturn.numberValueProperty.value > NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE ) {
        const amountRemaining = paperNumberToReturn.numberValueProperty.value - NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE;
        paperNumberToReturn.changeNumber( amountRemaining );

        paperNumberToReturn = new PaperNumber(
          NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE,
          paperNumberToReturn.positionProperty.value, {
            groupingEnabledProperty: this.groupingEnabledProperty
          } );
        this.addPaperNumber( paperNumberToReturn );
      }

      // set its value to 0 and send it back to its origin. paperNumbers aren't removed from the playArea until they get
      // back to the bucket, but we don't want them to count towards the sum while they're on their way to the bucket.
      // this allows for multiple paperNumbers to be returning to the bucket at the same time instead of only one at a
      // time.
      paperNumberToReturn.numberValueProperty.value = 0;
      const origin = this.getPaperNumberOrigin().minus( paperNumberToReturn.localBounds.center );
      const scale = paperNumberToReturn.groupingEnabledProperty.value ? NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE :
                    NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE;
      paperNumberToReturn.setDestination( origin, true, scale );
    }
  }

  /**
   * Calculates the spots for organized objects
   */
  private calculateOrganizedObjectSpots(): Vector2[] {
    assert && assert( this.initialized === true, 'calculateOrganizedObjectSpots called before initialization' );

    const objectWidth = CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.width;
    const objectHeight = CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height;
    const objectMargin = 3;

    const numberOfColumns = 5; // rows
    const numberOfRows = this.currentNumberProperty.range!.max / numberOfColumns;

    const xMargin = 88; // empirically determined to center group TODO: figure out why math isn't working for this
    const yMargin = CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;

    const spots = [];

    for ( let i = 0; i < numberOfRows; i++ ) {
      for ( let j = 0; j < numberOfColumns; j++ ) {
        spots.push( new Vector2(
          this.playAreaBounds.minX + xMargin + ( ( objectWidth + objectMargin ) * j ),
          this.playAreaBounds.minY + yMargin + ( ( objectHeight + objectMargin ) * i )
        ) );
      }
    }
    return spots;
  }

  /**
   * Breaks apart all counting objects into counting objects with a value of 1. By default, it creates all new counting
   * objects in the position of the original counting object. If stack=true, it arranges them according to the
   * background shape of the original counting object.
   */
  public breakApartCountingObjects( stack: boolean = false ) {

    // TODO: cleanup and doc

    const objectsToBreakDown = [ ...this.paperNumbers ];
    objectsToBreakDown.forEach( paperNumber => {
      if ( paperNumber.numberValueProperty.value > 1 ) {
        const paperNumberPosition = paperNumber.positionProperty.value;
        const paperNumberValue = paperNumber.numberValueProperty.value;

        const numberOfSets = paperNumberValue < NumberPlayConstants.TEN ? 1 : 2;
        const numberOfRows = NumberPlayConstants.TEN;

        const origin = stack ? paperNumberPosition.minusXY( 0, 25 ) : paperNumberPosition;
        const offsetYSegment = stack ? ( paperNumber.localBounds.height - CountingCommonConstants.PLAY_OBJECT_SIZE.height ) /
                                       ( numberOfRows + 1 ) : 0;
        let offsetY = 0;

        let reAddedPaperNumbers = 0;
        const xShift = paperNumberValue >= NumberPlayConstants.TEN && stack ? -CountingCommonConstants.PLAY_OBJECT_SIZE.width : 0;

        this.removePaperNumber( paperNumber );

        for ( let i = numberOfSets - 1; i >= 0; i-- ) {
          for ( let j = 0; j < numberOfRows; j++ ) {
            if ( reAddedPaperNumbers < paperNumberValue ) {
              const newPaperNumber = new PaperNumber( 1, origin.plusXY( i * xShift, offsetY ), {
                groupingEnabledProperty: this.groupingEnabledProperty
              } );
              this.addPaperNumber( newPaperNumber );
              offsetY += offsetYSegment;
              reAddedPaperNumbers++;
            }
          }
          offsetY = 0;
        }
      }
    } );
  }

  /**
   * Organizes the playObjectsInPlayArea in a grid pattern. Can only be called if this.organizedObjectSpots exist.
   */
  public organizeObjects() {

    assert && assert( this.organizedObjectSpots, 'this.organizedObjectSpots must exist to call this function' );

    this.breakApartCountingObjects();

    // copy the current playObjectsInPlayArea so we can mutate it
    let objectsToOrganize = [ ...this.paperNumbers ].filter( paperNumber => paperNumber.numberValueProperty.value > 0 );
    const numberOfObjectsToOrganize = objectsToOrganize.length;

    for ( let i = 0; i < numberOfObjectsToOrganize; i++ ) {
      const destination = this.organizedObjectSpots[ i ];

      // sort the  playObjectToOrganize by closest to the destination
      objectsToOrganize = _.sortBy( objectsToOrganize, object => {
        return object.positionProperty.value.distance( destination );
      } );
      const objectToOrganize = objectsToOrganize.shift();

      objectToOrganize && objectToOrganize.setDestination( destination, true, NumberPlayConstants.COUNTING_OBJECT_SCALE );
    }
  }

  /**
   * Updates the total sum of the paper numbers.
   */
  private calculateTotal() {
    let total = 0;
    this.paperNumbers.forEach( ( paperNumber: PaperNumber ) => {
      total += paperNumber.numberValueProperty.value;
    } );
    this.sumProperty.value = total;
  }
}

numberPlay.register( 'OnesPlayArea', OnesPlayArea );
export default OnesPlayArea;
