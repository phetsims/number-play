// Copyright 2019, University of Colorado Boulder

/**
 * Model class for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const ComparePlayArea = require( 'NUMBER_PLAY/compare/model/ComparePlayArea' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  class CompareModel {

    /**
     * @param {number} highestCount - the highest integer number that can be counted to
     * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
     * @param {number} objectMaxScale - see PlayObject for doc
     * @param {Tandem} tandem
     */
    constructor( highestCount, paperNumberOrigin, objectMaxScale, tandem ) {

      // @public {NumberProperty}
      this.leftCurrentNumberProperty = new NumberProperty( 0, {
        range: new Range( 0, highestCount )
      } );
      this.rightCurrentNumberProperty = new NumberProperty( 0, {
        range: new Range( 0, highestCount )
      } );

      // @public {BooleanProperty} - for checkboxes
      this.comparisonSignsVisibleProperty = new BooleanProperty( true );
      this.blockValuesVisibleProperty = new BooleanProperty( true );

      // @public {BooleanProperty} - see NumberPlayModel for doc
      this.isResettingProperty = new BooleanProperty( false );

      // @public
      this.leftPlayArea = new ComparePlayArea( this.leftCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
      this.rightPlayArea = new ComparePlayArea( this.rightCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
    }

    /**
     * Steps the model.
     * @param {number} dt - time step, in seconds
     * @public
     */
    step( dt ) {
      this.leftPlayArea.step( dt );
      this.rightPlayArea.step( dt );
    }

    /**
     * Resets the model.
     * @public
     */
    reset() {
      this.isResettingProperty.value = true;
      this.leftPlayArea.reset();
      this.rightPlayArea.reset();
      this.leftCurrentNumberProperty.reset();
      this.rightCurrentNumberProperty.reset();
      this.comparisonSignsVisibleProperty.reset();
      this.blockValuesVisibleProperty.reset();
      this.isResettingProperty.reset();
    }
  }

  return numberPlay.register( 'CompareModel', CompareModel );
} );