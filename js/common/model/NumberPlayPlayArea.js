// Copyright 2019, University of Colorado Boulder

/**
 * Model class for a Number Play play area.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Animation = require( 'TWIXT/Animation' );
  const Bucket = require( 'PHETCOMMON/model/Bucket' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Easing = require( 'TWIXT/Easing' );
  const merge = require( 'PHET_CORE/merge' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BUCKET_SIZE = new Dimension2( 100, 50 );
  const ANIMATION_SPEED = 200; // in screen coordinates per second
  const MAX_ANIMATION_TIME = 1; // in seconds

  class NumberPlayPlayArea {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {Object} [options]
     */
    constructor( currentNumberProperty, options ) {

      options = merge( {}, options );

      assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

      this.bucket = new Bucket( {
        baseColor: 'rgb(100,101,162)',
        size: BUCKET_SIZE
      } );

      this.playObjects = [];
      _.times( currentNumberProperty.range.max, () => {
        const x = phet.joist.random.nextDouble() * BUCKET_SIZE.width / 2 - BUCKET_SIZE.width / 4;
        const y = phet.joist.random.nextDouble() * BUCKET_SIZE.height / 2 + BUCKET_SIZE.height / 2;
        this.playObjects.push( new PlayObject( new Vector2( x, y ), new Dimension2( 40, 40 ) ) );
      } );

      // @private - track play objects that are added to the play area
      this.playObjectsInPlayArea = new ObservableArray();

      // if a play object is added or removed from the play area, update the current number
      this.playObjectsInPlayArea.lengthProperty.link( length => {
        currentNumberProperty.value = length;
      } );
    }

    returnPlayObjectToBucket( playObject ) {
      this.playObjectsInPlayArea.contains( playObject ) && this.playObjectsInPlayArea.remove( playObject );

      // calculate the time needed to get to the destination
      const animationDuration = Math.min(
        playObject.positionProperty.value.distance( playObject.positionProperty.initialValue ) / ANIMATION_SPEED,
        MAX_ANIMATION_TIME
      );
      const animationOptions = {
        property: playObject.positionProperty,
        to: playObject.positionProperty.initialValue,
        duration: animationDuration,
        easing: Easing.CUBIC_IN_OUT
      };
      const translateAnimation = new Animation( animationOptions );
      translateAnimation.start();
    }

    addPlayObjectToPlayArea( playObject ) {
      !this.playObjectsInPlayArea.contains( playObject ) && this.playObjectsInPlayArea.push( playObject );
    }

    /**
     * @public
     */
    reset() {
      this.playObjects.forEach( playObject => {
        playObject.reset();
      } );
    }
  }

  return numberPlay.register( 'NumberPlayPlayArea', NumberPlayPlayArea );
} );