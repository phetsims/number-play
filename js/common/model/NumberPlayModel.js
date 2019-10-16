// Copyright 2019, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayPlayArea = require( 'NUMBER_PLAY/common/model/NumberPlayPlayArea' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class NumberPlayModel {

    /**
     * @param {number} highestCount - the highest integer number that can be counted to
     * @param {Tandem} tandem
     */
    constructor( highestCount, tandem ) {

      // @public {NumberProperty} - the current "counted to" number, which is the central aspect of this whole sim
      this.currentNumberProperty = new NumberProperty( 0, {
        range: new Range( 0, highestCount )
      } );

      // @public (read-only) - the model for managing the play area in the ObjectsAccordionBox
      this.objectsPlayArea = new NumberPlayPlayArea( this.currentNumberProperty );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.currentNumberProperty.reset();
      this.objectsPlayArea.reset();
    }
  }

  return numberPlay.register( 'NumberPlayModel', NumberPlayModel );
} );