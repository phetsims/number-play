// Copyright 2019, University of Colorado Boulder

/**
 * Model class for a play object, which is any draggable item in the ObjectsAccordionBox
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );
  const Vector2Property = require( 'DOT/Vector2Property' );

  class PlayObject {

    /**
     * @param {Vector2} initialPosition
     * @param {Dimension2} size
     * @param {number} objectMaxScale - the max scale this play object can be increased by
     */
    constructor( initialPosition, size, objectMaxScale ) {

      // @public {Vector2Property}
      this.positionProperty = new Vector2Property( initialPosition );

      // @public {BooleanProperty}
      this.userControlledProperty = new BooleanProperty( false );

      // @public {BooleanProperty}
      this.scaleProperty = new NumberProperty( 1, {
        range: new Range( 1, objectMaxScale )
      } );

      // @public {null|Animation} - store any animations for this playObject so we can check if one is still running
      this.animation = null;

      // @public (read-only) {Dimension2}
      this.size = size;
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
      this.scaleProperty.reset();
    }
  }

  return numberPlay.register( 'PlayObject', PlayObject );
} );