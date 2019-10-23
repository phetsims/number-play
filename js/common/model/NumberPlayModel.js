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
  const ObjectsPlayArea = require( 'NUMBER_PLAY/common/model/ObjectsPlayArea' );
  const OnesPlayArea = require( 'NUMBER_PLAY/common/model/OnesPlayArea' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class NumberPlayModel {

    /**
     * @param {number} highestCount - the highest integer number that can be counted to
     * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
     * @param {number} objectMaxScale - see PlayObject for doc
     * @param {Vector2} organizedObjectPadding - see ObjectsPlayArea for doc
     * @param {Tandem} tandem
     */
    constructor( highestCount, paperNumberOrigin, objectMaxScale, organizedObjectPadding, tandem ) {

      // @public {NumberProperty} - the current "counted to" number, which is the central aspect of this whole sim
      this.currentNumberProperty = new NumberProperty( 0, {
        range: new Range( 0, highestCount )
      } );

      // @public (read-only) - the model for managing the play area in the OnesAccordionBox
      this.onesPlayArea = new OnesPlayArea( this.currentNumberProperty, paperNumberOrigin );

      // @public (read-only) - the model for managing the play area in the ObjectsAccordionBox
      this.objectsPlayArea = new ObjectsPlayArea( this.currentNumberProperty, objectMaxScale, organizedObjectPadding );
    }

    /**
     * Steps the model.
     * @param {number} dt
     */
    step( dt ) {
      this.onesPlayArea.step( dt );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.onesPlayArea.reset();
      this.objectsPlayArea.reset();
      this.currentNumberProperty.reset();
    }
  }

  return numberPlay.register( 'NumberPlayModel', NumberPlayModel );
} );