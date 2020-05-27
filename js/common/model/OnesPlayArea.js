// Copyright 2019-2020, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers. This file was
 * copied from make-a-ten/common/model/MakeATenCommonModel.js and make-a-ten/explore/model/MakeATenExploreModel.js and
 * then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PaperNumber from '../../../../make-a-ten/js/make-a-ten/common/model/PaperNumber.js';
import merge from '../../../../phet-core/js/merge.js';
import Bucket from '../../../../phetcommon/js/model/Bucket.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

// TODO: These shouldn't be constants since the ones play area is different sizes between screens
// min and max distances that playObjects being added to the play area via animation can travel. empirically
// determined to be small enough to fit all needed cases. all in screen coordinates.
const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = -6;
const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = 280;
const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = -80;
const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = -230;

// the minimum distance that a playObject added to the play area via animation can be to another playObject in the
// play area, in screen coordinates
const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 60;

class OnesPlayArea {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {Vector2} paperNumberOrigin - origin of where paper numbers are created, but only used when the model is
   * responding to changes in currentNumberProperty, not when a user drags a paperNumber out of the bucket
   * @param {BooleanProperty} isResetting
   * TODO: paperNumberOrigin is a band-aid since paperNumberNodes don't use MVT
   */
  constructor( currentNumberProperty, paperNumberOrigin, isResettingProperty, options ) {

    assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

    options = merge( {
      bucketPosition: Vector2.ZERO // {Vector2}
    }, options );

    // @public
    this.currentNumberProperty = currentNumberProperty;

    // @public {NumberProperty} - The total sum of the current numbers
    this.sumProperty = new NumberProperty( currentNumberProperty.range.min, {
      range: currentNumberProperty.range
    } );

    // @public {ObservableArray.<PaperNumber>} - Numbers in play that can be interacted with.
    this.paperNumbers = new ObservableArray();

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

    // @public (read-only)
    this.bucket = new Bucket( {
      baseColor: NumberPlayConstants.BUCKET_BASE_COLOR,
      size: NumberPlayConstants.BUCKET_SIZE,
      position: options.bucketPosition
    } );

    // @public {boolean} whether the view of this play area is controlling the current number
    this.isControllingCurrentNumber = false;

    // if the current number changes, add or remove paperNumbers from the play area
    currentNumberProperty.link( ( currentNumber, previousNumber ) => {
      if ( !this.isControllingCurrentNumber && !isResettingProperty.value ) {
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
              this.createPaperNumberFromBucket( paperNumberOrigin );
            }
          } );
        }
      }
    } );
  }

  /**
   * Creates a paperNumber and animates it to a random open place in the play area.
   *
   * @param paperNumberOrigin
   * @private
   */
  createPaperNumberFromBucket( paperNumberOrigin ) {
    let translateVector = null;
    let findCount = 0;

    const paperNumber = new PaperNumber( NumberPlayConstants.PAPER_NUMBER_INITIAL_VALUE, paperNumberOrigin );

    // looks for positions that are not overlapping with other playObjects in the play area
    while ( !translateVector ) {
      const possibleTranslateX = phet.joist.random.nextDouble() *
                                 ( MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X - MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X ) +
                                 MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X;
      const possibleTranslateY = phet.joist.random.nextDouble() *
                                 ( MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y - MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y ) +
                                 MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y;
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

    paperNumber.setDestination( destinationPosition, true );
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
    const sortedPaperNumbers = _.sortBy( this.paperNumbers.getArray(), [
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
   * @param {number} dt
   * @public
   */
  step( dt ) {

    // Cap large dt values, which can occur when the tab containing
    // the sim had been hidden and then re-shown
    dt = Math.min( 0.1, dt );

    for ( let i = 0; i < this.paperNumbers.length; i++ ) {
      this.paperNumbers.get( i ).step( dt );
    }

    // Animate fading if necessary
    // this.splitCue.step( dt );
  }

  /**
   * Updates the total sum of the paper numbers.
   * @private
   */
  calculateTotal() {
    let total = 0;
    this.paperNumbers.forEach( function( paperNumber ) {
      total += paperNumber.numberValueProperty.value;
    } );
    this.sumProperty.value = total;
  }

  /**
   * Given two paper numbers, combine them (set one's value to the sum of their previous values, and remove the
   * other).
   *
   * @param {Bounds2} availableModelBounds - Constrain the position to be inside these bounds
   * @param {PaperNumber} draggedPaperNumber
   * @param {PaperNumber} dropTargetNumber
   * @public
   */
  collapseNumberModels( availableModelBounds, draggedPaperNumber, dropTargetNumber ) {
    const dropTargetNumberValue = dropTargetNumber.numberValueProperty.value;
    const draggedNumberValue = draggedPaperNumber.numberValueProperty.value;
    const newValue = dropTargetNumberValue + draggedNumberValue;

    let numberToRemove;
    let numberToChange;

    // See https://github.com/phetsims/make-a-ten/issues/260
    if ( draggedPaperNumber.digitLength === dropTargetNumber.digitLength ) {
      numberToRemove = draggedPaperNumber;
      numberToChange = dropTargetNumber;
    }
    else {
      // The larger number gets changed, the smaller one gets removed.
      const droppingOnLarger = dropTargetNumberValue > draggedNumberValue;
      numberToRemove = droppingOnLarger ? draggedPaperNumber : dropTargetNumber;
      numberToChange = droppingOnLarger ? dropTargetNumber : draggedPaperNumber;
    }

    // Apply changes
    this.removePaperNumber( numberToRemove );
    numberToChange.changeNumber( newValue );
    numberToChange.setConstrainedDestination( availableModelBounds, numberToChange.positionProperty.value, false );
  }

  /**
   * Add a PaperNumber to the model
   * @public
   *
   * @param {PaperNumber} paperNumber
   */
  addPaperNumber( paperNumber ) {
    this.paperNumbers.push( paperNumber );
  }

  /**
   * Remove a PaperNumber from the model
   * @public
   *
   * @param {PaperNumber} paperNumber
   */
  removePaperNumber( paperNumber ) {
    this.paperNumbers.remove( paperNumber );
  }

  /**
   * Remove all PaperNumbers from the model.
   * @public
   *
   * @param {PaperNumber} paperNumber
   */
  removeAllPaperNumbers() {
    this.paperNumbers.clear();
  }

  /**
   * @public
   */
  reset() {
    this.removeAllPaperNumbers();
  }
}

numberPlay.register( 'OnesPlayArea', OnesPlayArea );
export default OnesPlayArea;
