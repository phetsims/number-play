// Copyright 2019-2021, University of Colorado Boulder

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
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import CountingCommonModel from '../../../../counting-common/js/common/model/CountingCommonModel.js';
import PaperNumber from '../../../../counting-common/js/common/model/PaperNumber.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// TODO: These shouldn't be constants since the ones play area is different sizes between screens
// min and max distances that playObjects being added to the play area via animation can travel. empirically
// determined to be small enough to fit all needed cases. all in screen coordinates.
const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = -6;
const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = 280;
const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = -80;
const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = -230;
const ANIMATE_INTO_PLAY_AREA_BOUNDS = new Bounds2(
  MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X,
  MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y,
  MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X,
  MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y
);

// the minimum distance that a playObject added to the play area via animation can be to another playObject in the
// play area, in screen coordinates
const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 60;

class OnesPlayArea extends CountingCommonModel {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {Vector2} paperNumberOrigin - origin of where paper numbers are created, but only used when the model is
   * responding to changes in currentNumberProperty, not when a user drags a paperNumber out of the bucket
   * @param {object} [options]
   * TODO: paperNumberOrigin is a band-aid since paperNumberNodes don't use MVT
   */
  constructor( currentNumberProperty, paperNumberOrigin, options ) {
    super();

    options = merge( {
      isResettingProperty: null,
      isOnes: true,
      // TODO: yikes! for the last 3 options, they are quick fixes that will change soon
      sumPropertyRange: null,
      setAllObjects: false,
      animateIntoPlayAreaBounds: new Bounds2( 20, 0, 500, 230 )
    }, options );

    assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

    // @public
    this.currentNumberProperty = currentNumberProperty;

    // @private
    this.paperNumberOrigin = paperNumberOrigin;

    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( currentNumberProperty.range.min, {
      range: options.sumPropertyRange || currentNumberProperty.range
    } );

    // @private {Function} - To be called when we need to recalculate the total
    const calculateTotalListener = this.calculateTotal.bind( this );

    this.paperNumbers.lengthProperty.link( calculateTotalListener );

    // Listen to number changes of paper numbers
    this.paperNumbers.addItemAddedListener( paperNumber => {
      paperNumber.numberValueProperty.link( calculateTotalListener );
    } );
    this.paperNumbers.addItemRemovedListener( paperNumber => {
      paperNumber.numberValueProperty.unlink( calculateTotalListener );
    } );

    // @public {boolean} whether the view of this play area is controlling the current number
    this.isControllingCurrentNumber = false;

    const objectBounds = options.isOnes ? new BaseNumber( 1, 0 ).bounds : CountingCommonConstants.PLAY_OBJECT_SIZE;

    // @private {Vector2[]}
    this.organizedObjectSpots = this.calculateOrganizedObjectSpots( objectBounds.width, objectBounds.height );

    // if the current number changes, add or remove paperNumbers from the play area
    currentNumberProperty.link( ( currentNumber, previousNumber ) => {
      if ( options.isResettingProperty && !options.isResettingProperty.value && !this.isControllingCurrentNumber ) {
        if ( currentNumber < previousNumber ) {
          _.times( previousNumber - currentNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.sumProperty.value > currentNumberProperty.range.min ) {
              this.returnPaperNumberToBucket( paperNumberOrigin );
            }
          } );
        }
        else if ( currentNumber > previousNumber ) {
          _.times( currentNumber - previousNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.sumProperty.value < currentNumberProperty.range.max ) {
              this.createPaperNumberFromBucket( paperNumberOrigin, ANIMATE_INTO_PLAY_AREA_BOUNDS );
            }
          } );
        }
      }
      else if ( options.setAllObjects ) {
        this.createAllObjects( currentNumber, options.animateIntoPlayAreaBounds );
      }
    } );
  }

  /**
   * Create and randomly position a group of objects whose sum is the current number.
   *
   * @private
   */
  createAllObjects( currentNumber, animateIntoPlayAreaBounds ) {
    this.removeAllPaperNumbers();

    _.times( currentNumber, () => {
      this.createPaperNumberFromBucket( this.paperNumberOrigin, animateIntoPlayAreaBounds, false );
    } );
  }

  /**
   * Creates a paperNumber and animates it to a random open place in the play area.
   *
   * @param paperNumberOrigin
   * @private
   */
  createPaperNumberFromBucket( paperNumberOrigin, animateIntoPlayAreaBounds, shouldAnimate = true ) {
    let translateVector = null;
    let findCount = 0;

    const paperNumber = new PaperNumber( NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE, paperNumberOrigin );

    // looks for positions that are not overlapping with other playObjects in the play area
    while ( !translateVector ) {
      const possibleTranslateX = dotRandom.nextDouble() *
                                 ( animateIntoPlayAreaBounds.maxX - animateIntoPlayAreaBounds.minX ) +
                                 animateIntoPlayAreaBounds.minX;
      const possibleTranslateY = dotRandom.nextDouble() *
                                 ( animateIntoPlayAreaBounds.maxY - animateIntoPlayAreaBounds.minY ) +
                                 animateIntoPlayAreaBounds.minY;
      let spotIsAvailable = true;
      const numberOfPaperNumbersInPlayArea = this.paperNumbers.lengthProperty.value;

      // compare the proposed destination to the position of every playObject in the play area. use c-style loop for
      // best performance, since this loop is nested
      for ( let i = 0; i < numberOfPaperNumbersInPlayArea; i++ ) {
        if ( this.paperNumbers.get( i ).positionProperty.value.distance(
               paperNumber.positionProperty.value.plusXY( possibleTranslateX, possibleTranslateY ) )
             < MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS ) {
          spotIsAvailable = false;
        }
      }

      // bail if taking a while to find a spot. 1000 empirically determined.
      if ( ++findCount > 1000 ) {
        spotIsAvailable = true;
      }
      translateVector = spotIsAvailable && new Vector2( possibleTranslateX, possibleTranslateY );
    }

    const destinationPosition = paperNumber.positionProperty.value.plus( translateVector );

    paperNumber.setDestination( destinationPosition, shouldAnimate );
    this.addPaperNumber( paperNumber );
  }

  /**
   * Finds the closest paperNumber to their origin and animates it back over the bucket. If only paperNumbers with
   * values greater than one exist, break them up and send their components with values of one back.
   *
   * @param paperNumberOrigin
   * @private
   */
  returnPaperNumberToBucket( paperNumberOrigin ) {
    assert && assert( this.paperNumbers.lengthProperty.value > 0, 'paperNumbers should exist in play area' );

    // sort by lowest value first, then by proximity to the bucket
    const sortedPaperNumbers = _.sortBy( this.paperNumbers, [
      paperNumber => {
        return paperNumber.numberValueProperty.value;
      },
      paperNumber => {
        return paperNumber.positionProperty.value.distance( paperNumberOrigin );
      }
    ] );

    // remove any paperNumbers with a value of 0 - these are already on their way back to the bucket
    _.remove( sortedPaperNumbers, paperNumber => {
      return paperNumber.numberValueProperty.value === 0;
    } );

    let paperNumberToReturn = sortedPaperNumbers.shift();

    // if the chosen paperNumber has a value greater than 1, break it up by creating a new paperNumber with a value of
    // 1 to return instead
    if ( paperNumberToReturn.numberValueProperty.value > NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE ) {
      const amountRemaining = paperNumberToReturn.numberValueProperty.value - NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE;
      paperNumberToReturn.changeNumber( amountRemaining );

      const singlePaperNumberToReturn = new PaperNumber(
        NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE,
        paperNumberToReturn.positionProperty.value
      );
      paperNumberToReturn = singlePaperNumberToReturn;
      this.addPaperNumber( paperNumberToReturn );
    }

    // set its value to 0 and send it back to its origin. paperNumbers aren't removed from the playArea until they get
    // back to the bucket, but we don't want them to count towards the sum while they're on their way to the bucket.
    // this allows for multiple paperNumbers to be returning to the bucket at the same time instead of only one at a
    // time.
    paperNumberToReturn.numberValueProperty.value = 0;
    paperNumberToReturn.setDestination( paperNumberOrigin, true );
  }

  /**
   * Calculates the spots for organized objects
   *
   * @param {Vector2} organizedObjectPadding - x and y padding for playObjects organized in a grid
   * @returns {Vector2[]}
   * @private
   */
  calculateOrganizedObjectSpots( objectWidth, objectHeight ) {
    const gridWidth = 5; // empirically determined
    const gridHeight = this.currentNumberProperty.range.max / gridWidth;
    const organizedObjectPadding = new Vector2( 5, 8 );
    const yOffset = MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y - ( objectHeight * 2 / gridHeight );

    const spots = [];

    // iterate through and store the center point of every spot
    for ( let i = 0; i < gridHeight; i++ ) {
      for ( let j = 0; j < gridWidth; j++ ) {
        spots.push( new Vector2(
          this.paperNumberOrigin.x + MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X + ( ( objectWidth + organizedObjectPadding.x ) * j ),
          this.paperNumberOrigin.y + yOffset + ( ( objectHeight + organizedObjectPadding.y ) * i )
        ) );
      }
    }
    return spots;
  }

  /**
   * Organizes the playObjectsInPlayArea in a grid pattern. Can only be called if this.organizedObjectSpots exist.
   *
   * @public
   */
  organizeObjects() {

    assert && assert( this.organizedObjectSpots, 'this.organizedObjectSpots must exist to call this function' );

    const objectsToBreakDown = [ ...this.paperNumbers ];
    objectsToBreakDown.forEach( paperNumber => {
      if ( paperNumber.numberValueProperty.value > 1 ) {
        const paperNumberPosition = paperNumber.positionProperty.value;
        const paperNumberValue = paperNumber.numberValueProperty.value;
        this.removePaperNumber( paperNumber );

        for ( let i = 0; i < paperNumberValue; i++ ) {
          const newPaperNumber = new PaperNumber( 1, paperNumberPosition );
          this.addPaperNumber( newPaperNumber );
        }
      }
    } );

    // copy the current playObjectsInPlayArea so we can mutate it
    let objectsToOrganize = [ ...this.paperNumbers ];
    const numberOfObjectsToOrganize = objectsToOrganize.length;

    for ( let i = 0; i < numberOfObjectsToOrganize; i++ ) {
      const destination = this.organizedObjectSpots[ i ];

      // sort the  playObjectToOrganize by closest to the destination
      objectsToOrganize = _.sortBy( objectsToOrganize, object => {
        return object.positionProperty.value.distance( destination );
      } );
      const objectToOrganize = objectsToOrganize.shift();

      objectToOrganize.setDestination( destination, true );
    }
  }

  /**
   * @param {number} dt
   * @public
   */
  step( dt ) {
    super.step( dt );

    // Animate fading if necessary
    // this.splitCue.step( dt );
  }

  /**
   * Updates the total sum of the paper numbers.
   * @private
   */
  calculateTotal() {
    let total = 0;
    this.paperNumbers.forEach( paperNumber => {
      total += paperNumber.numberValueProperty.value;
    } );
    this.sumProperty.value = total;
  }
}

numberPlay.register( 'OnesPlayArea', OnesPlayArea );
export default OnesPlayArea;
