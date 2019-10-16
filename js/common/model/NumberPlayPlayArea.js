// Copyright 2019, University of Colorado Boulder

/**
 * Model class for a Number Play play area, which includes a play area and a bucket of playObjects. any playObjects
 * remaining in the bucket are considered to be outside of the play area.
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
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BUCKET_SIZE = new Dimension2( 100, 50 ); // in screen coordinates
  const ANIMATION_SPEED = 200; // in screen coordinates per second
  const MAX_ANIMATION_TIME = 1; // in seconds

  // min and max distances that playObjects being added to the play area via animation can travel. empirically
  // determined to be small enough to fit all needed cases. all in screen coordinates.
  const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = -90;
  const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = 90;
  const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = 50;
  const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = 320;

  // the minimum distance that a playObject added to the play area via animation can be to another playObject in the
  // play area, in screen coordinates
  const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 60;

  class NumberPlayPlayArea {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {Object} [options]
     */
    constructor( currentNumberProperty, options ) {

      options = merge( {}, options );

      assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

      // @public (read-only)
      this.bucket = new Bucket( {
        baseColor: NumberPlayConstants.BUCKET_BASE_COLOR,
        size: BUCKET_SIZE
      } );

      // @public (read-only) - all of the playObjects being managed
      this.playObjects = [];
      _.times( currentNumberProperty.range.max, () => {
        const x = phet.joist.random.nextDouble() * BUCKET_SIZE.width / 2 - BUCKET_SIZE.width / 4;
        const y = phet.joist.random.nextDouble() * BUCKET_SIZE.height / 2 + BUCKET_SIZE.height / 2;
        this.playObjects.push( new PlayObject( new Vector2( x, y ), new Dimension2( 40, 40 ) ) );
      } );

      // @private - all playObjects that are currently in the play area
      this.playObjectsInPlayArea = new ObservableArray();

      // if a playObject is added or removed from the play area, update the current number
      this.playObjectsInPlayArea.lengthProperty.link( length => {
        currentNumberProperty.value = length;
      } );

      // if the current number changes, add or remove playObjects from the play area
      currentNumberProperty.link( ( currentNumber, previousNumber ) => {
        if ( currentNumber < this.playObjectsInPlayArea.lengthProperty.value ) {
          assert && assert( currentNumber < previousNumber );

          const playObjectsToReturn = previousNumber - currentNumber;

          // TODO: workaround for reset, which causes a reentrant problem without this guard. However, this is not a
          // TODO: long term solution, as playObjects can still animate back when they shouldn't and vice versa.
          if ( !( playObjectsToReturn > 1 && currentNumber === 0 ) ) {
            _.times( playObjectsToReturn, () => {
              this.findPlayObjectToReturnToBucket();
            } );
          }
        }
        else if ( currentNumber > this.playObjectsInPlayArea.lengthProperty.value ) {
          assert && assert( currentNumber > previousNumber );

          _.times( currentNumber - previousNumber, () => {
            this.findPlayObjectToAddToPlayArea();
          } );
        }
      } );
    }

    /**
     * Animates the given playObject back into the bucket and removes it from playObjectsInPlayArea. If the given
     * playObject is already in the bucket, that's okay - it just animates back to its initial position if need be.
     *
     * @param {PlayObject} playObject
     * @public
     */
    returnPlayObjectToBucket( playObject ) {
      this.playObjectsInPlayArea.contains( playObject ) && this.playObjectsInPlayArea.remove( playObject );

      if ( playObject.positionProperty.value !== playObject.positionProperty.initialValue ) {

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

    }

    /**
     * Adds the given playObject to playObjectsInPlayArea. If animateToPlayArea is provided, select a playObject in the
     * bucket and animate it to an open spot in the play area.
     *
     * @param {PlayObject} playObject
     * @param {boolean} [animateToPlayArea]
     * @public
     */
    addPlayObjectToPlayArea( playObject, animateToPlayArea = false ) {
      if ( animateToPlayArea ) {
        assert( !this.playObjectsInPlayArea.contains( playObject ), 'playObject is already in play area' );

        let translateVector = null;
        let findCount = 0;

        // looks for positions that are not overlapping with other playObjects in the play area
        while ( !translateVector ) {
          const possibleTranslateX = phet.joist.random.nextDouble() *
                                     ( MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X - MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X ) +
                                     MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X;
          const possibleTranslateY = phet.joist.random.nextDouble() *
                                     ( MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y - MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y ) +
                                     MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y;
          let spotIsAvailable = true;
          const numberOfPlayObjectInPlayArea = this.playObjectsInPlayArea.lengthProperty.value;

          // compare the proposed destination to the position of every playObject in the play area. use c-style loop for
          // best performance, since this loop is nested
          for ( let i = 0; i < numberOfPlayObjectInPlayArea; i++ ) {
            if ( this.playObjectsInPlayArea.get( i ).positionProperty.value.distance(
              playObject.positionProperty.value.plusXY( possibleTranslateX, possibleTranslateY ) )
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
        const destinationPosition = playObject.positionProperty.value.plus( translateVector );

        // calculate the time needed to get to the destination
        const animationDuration = Math.min(
          playObject.positionProperty.value.distance( destinationPosition ) / ANIMATION_SPEED,
          MAX_ANIMATION_TIME
        );
        const animationOptions = {
          property: playObject.positionProperty,
          to: destinationPosition,
          duration: animationDuration,
          easing: Easing.CUBIC_IN_OUT
        };
        const translateAnimation = new Animation( animationOptions );
        translateAnimation.start();
      }

      // add playObject to playObjectsInPlayArea if not already in the list
      !this.playObjectsInPlayArea.contains( playObject ) && this.playObjectsInPlayArea.push( playObject );
    }

    /**
     * Finds the closest playObject in the playArea to the bucket, then sends it to returnPlayObjectToBucket.
     *
     * @private
     */
    findPlayObjectToReturnToBucket() {
      assert && assert( this.playObjectsInPlayArea.lengthProperty.value > 0, 'playObject should exist in play area' );

      let playObjectClosestToBucket = this.playObjectsInPlayArea.get( 0 );

      // look at each playObjectInPlayArea to find the closest one to the bucket
      this.playObjectsInPlayArea.forEach( playObjectInPlayArea => {
        if ( playObjectInPlayArea.positionProperty.value.distance( this.bucket.position ) <
             playObjectClosestToBucket.positionProperty.value.distance( this.bucket.position ) ) {
          playObjectClosestToBucket = playObjectInPlayArea;
        }
      } );

      this.returnPlayObjectToBucket( playObjectClosestToBucket );
    }

    /**
     * Finds a playObject in the bucket, then sends it to addPlayObjectToPlayArea.
     *
     * @private
     */
    findPlayObjectToAddToPlayArea() {
      assert && assert( this.playObjectsInPlayArea.lengthProperty.value < this.playObjects.length,
        'All playObjects are already in the play area' );

      let playObjectToAddToPlayArea = null;

      // look top down for a playObject that is still in the bucket
      for ( let i = this.playObjects.length - 1; i >= 0; i-- ) {
        if ( !this.playObjectsInPlayArea.contains( this.playObjects[ i ] ) ) {
          playObjectToAddToPlayArea = this.playObjects[ i ];
        }
      }

      playObjectToAddToPlayArea && this.addPlayObjectToPlayArea( playObjectToAddToPlayArea, true );
    }

    /**
     * @public
     */
    reset() {
      this.playObjects.forEach( playObject => {
        playObject.reset();
      } );
      this.playObjectsInPlayArea.clear();
    }
  }

  return numberPlay.register( 'NumberPlayPlayArea', NumberPlayPlayArea );
} );