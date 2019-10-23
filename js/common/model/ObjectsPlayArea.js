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
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObservableArray = require( 'AXON/ObservableArray' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const BUCKET_SIZE = NumberPlayConstants.BUCKET_SIZE;
  const ANIMATION_SPEED = 200; // in screen coordinates per second
  const MAX_ANIMATION_TIME = 1; // in seconds

  // TODO: make this more general, perhaps relate to bounds used in ObjectsAccordionBox
  // min and max distances that playObjects being added to the play area via animation can travel. empirically
  // determined to be small enough to fit all needed cases. all in screen coordinates.
  const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = -20;
  const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_X = 190;
  const MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = 110;
  const MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y = 350;

  // the minimum distance that a playObject added to the play area via animation can be to another playObject in the
  // play area, in screen coordinates
  const MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS = 70;

  class ObjectsPlayArea {

    /**
     * @param {NumberProperty} currentNumberProperty
     * @param {number} objectMaxScale - see PlayObject for doc
     */
    constructor( currentNumberProperty, objectMaxScale ) {

      assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

      // @private
      this.currentNumberProperty = currentNumberProperty;

      // @public (read-only)
      this.bucket = new Bucket( {
        baseColor: NumberPlayConstants.BUCKET_BASE_COLOR,
        size: BUCKET_SIZE
      } );

      // @public - the current type of playObject being displayed
      this.playObjectTypeProperty = new EnumerationProperty( PlayObjectType, PlayObjectType.DOG );

      const initialSpots = [
        new Vector2( -BUCKET_SIZE.width * 0.25, BUCKET_SIZE.height * 0.75 ),
        new Vector2( 0, BUCKET_SIZE.height ),
        new Vector2( BUCKET_SIZE.width * 0.25, BUCKET_SIZE.height * 0.75 )
      ];
      let spotIndex = 0;

      // @public (read-only) - all of the playObjects being managed
      this.playObjects = [];
      _.times( currentNumberProperty.range.max, () => {
        this.playObjects.push( new PlayObject(
          this.playObjectTypeProperty,
          initialSpots[ spotIndex ].copy(),
          new Dimension2( 40, 40 ),
          objectMaxScale
        ) );

        ++spotIndex;
        if ( spotIndex > initialSpots.length - 1 ) {
          spotIndex = 0;
        }
      } );

      // @private - all playObjects that are currently in the play area
      this.playObjectsInPlayArea = new ObservableArray();

      // if the current number changes, add or remove playObjects from the play area
      currentNumberProperty.link( ( currentNumber, previousNumber ) => {
        if ( currentNumber < this.playObjectsInPlayArea.lengthProperty.value ) {
          _.times( previousNumber - currentNumber, () => {
            this.findPlayObjectToReturnToBucket();
          } );
        }
        else if ( currentNumber > this.playObjectsInPlayArea.lengthProperty.value ) {
          _.times( currentNumber - previousNumber, () => {
            this.findPlayObjectToAddToPlayArea();
          } );
        }
      } );
    }

    /**
     * Updates the value of currentNumberProperty to be the number of playObjects in the play area. Should only be
     * called when user-controlled state of one of the playObjects changes.
     */
    updateCurrentNumberProperty() {
      this.currentNumberProperty.value = this.playObjectsInPlayArea.lengthProperty.value;
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
      playObject.animation && playObject.animation.stop();

      if ( !playObject.positionProperty.value.equals( playObject.positionProperty.initialValue ) ) {

        // calculate the time needed to get to the destination
        const animationDuration = Math.min(
          playObject.positionProperty.value.distance( playObject.positionProperty.initialValue ) / ANIMATION_SPEED,
          MAX_ANIMATION_TIME
        );
        playObject.animation = new Animation( {
          duration: animationDuration,
          targets: [ {
            property: playObject.positionProperty,
            to: playObject.positionProperty.initialValue,
            easing: Easing.CUBIC_IN_OUT
          }, {
            property: playObject.scaleProperty,
            to: playObject.scaleProperty.range.min,
            from: playObject.scaleProperty.value
          } ]
        } );
        playObject.animation.start();
        playObject.animation.finishEmitter.addListener( function() {
          playObject.animation = null;
        } );
      }
      else {
        playObject.animation = new Animation( {
          property: playObject.scaleProperty,
          to: playObject.scaleProperty.range.min,
          from: playObject.scaleProperty.value,
          duration: MAX_ANIMATION_TIME / 2
        } );
        playObject.animation.start();
        playObject.animation.finishEmitter.addListener( function() {
          playObject.animation = null;
        } );
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
        assert && assert( !this.playObjectsInPlayArea.contains( playObject ), 'playObject is already in play area' );

        // finish any running animations. this is needed so that if a playObject is removed and then quickly added,
        // the added playObject animates out from the bucket and not its previous location in the play area
        if ( playObject.animation && playObject.animation.runningProperty.value ) {
          playObject.animation.step( MAX_ANIMATION_TIME );
        }

        let translateVector = null;
        let findCount = 0;
        let minDistance = MIN_DISTANCE_BETWEEN_ADDED_PLAY_OBJECTS;

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
              playObject.positionProperty.value.plusXY( possibleTranslateX, possibleTranslateY ) ) < minDistance ) {
              spotIsAvailable = false;
            }
          }

          // make it easier to find a spot if taking a while, then bail after even longer. empirically determined.
          if ( ++findCount === 1000 ) {
            minDistance = minDistance / 2;
            console.log( minDistance );
          }
          else if ( findCount > 2000 ) {
            spotIsAvailable = true;
          }
          translateVector = spotIsAvailable && new Vector2( possibleTranslateX, possibleTranslateY );
        }
        const destinationPosition = this.bucket.position.plus( translateVector );

        // calculate the time needed to get to the destination
        const animationDuration = Math.min(
          playObject.positionProperty.value.distance( destinationPosition ) / ANIMATION_SPEED,
          MAX_ANIMATION_TIME
        );
        playObject.animation = new Animation( {
          duration: animationDuration,
          targets: [ {
            property: playObject.positionProperty,
            to: destinationPosition,
            easing: Easing.CUBIC_IN_OUT
          }, {
            property: playObject.scaleProperty,
            to: playObject.scaleProperty.range.max,
            from: playObject.scaleProperty.value
          } ]
        } );
        playObject.animation.start();
        playObject.animation.finishEmitter.addListener( function() {
          playObject.animation = null;
        } );
      }
      else {
        if ( playObject.animation && playObject.animation.runningProperty.value ) {
          playObject.animation.stop();
          playObject.animation = null;
        }
        playObject.scaleProperty.value = playObject.scaleProperty.range.max;
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
          break;
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
      this.playObjectTypeProperty.reset();
    }
  }

  return numberPlay.register( 'ObjectsPlayArea', ObjectsPlayArea );
} );