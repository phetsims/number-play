// Copyright 2019, University of Colorado Boulder

/**
 * Model class for a Number Play play area.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bucket = require( 'PHETCOMMON/model/Bucket' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const merge = require( 'PHET_CORE/merge' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BUCKET_SIZE = new Dimension2( 100, 50 );

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
    }

    returnPlayObjectToBucket( playObject ) {
      console.log( 'returning to bucket' );
    }

    addPlayObjectToPlayArea( playObject ) {
      console.log( 'adding to play area' );
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