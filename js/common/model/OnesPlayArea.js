// Copyright 2015-2019, University of Colorado Boulder

/**
 * Model for the Explore screen in Make a Ten. Includes the total, cues, and adding in initial numbers. This file was
 * copied from make-a-ten/common/model/MakeATenCommonModel.js and make-a-ten/explore/model/MakeATenExploreModel.js and
 * then modified by @chrisklus to be used in number-play.
 *
 * @author Sharfudeen Ashraf
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bucket = require( 'PHETCOMMON/model/Bucket' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObservableArray = require( 'AXON/ObservableArray' );

  class OnesPlayArea {

    /**
     * @param {NumberProperty} currentNumberProperty
     */
    constructor( currentNumberProperty ) {

      // @public (read-only)
      this.bucket = new Bucket( {
        baseColor: NumberPlayConstants.BUCKET_BASE_COLOR,
        size: NumberPlayConstants.BUCKET_SIZE
      } );

      // @public {NumberProperty} - The total sum of the current numbers
      this.sumProperty = currentNumberProperty;

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
    }

    /**
     * @param {number} dt
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
     * @param {Bounds2} availableModelBounds - Constrain the location to be inside these bounds
     * @param {PaperNumber} draggedPaperNumber
     * @param {PaperNumber} dropTargetNumber
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
     * @override
     */
    reset() {
      this.removeAllPaperNumbers();
    }
  }

  return numberPlay.register( 'OnesPlayArea', OnesPlayArea );
} );
