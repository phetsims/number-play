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
  const Vector2Property = require( 'DOT/Vector2Property' );

  class PlayObject {

    /**
     * @param {Vector2} initialPosition
     * @param {Dimension2} size
     */
    constructor( initialPosition, size ) {

      // @public {Vector2Property}
      this.positionProperty = new Vector2Property( initialPosition );

      // @public {BooleanProperty}
      this.userControlledProperty = new BooleanProperty( false );

      // @public (read-only) {Dimension2}
      this.size = size;
    }

    /**
     * @public
     */
    reset() {
      this.positionProperty.reset();
      this.userControlledProperty.reset();
    }
  }

  return numberPlay.register( 'PlayObject', PlayObject );
} );