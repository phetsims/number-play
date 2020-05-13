// Copyright 2019-2020, University of Colorado Boulder

/**
 * Model class for a Number Play play area, which includes a play area and a bucket of playObjects. any playObjects
 * remaining in the bucket are considered to be outside of the play area.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Bucket from '../../../../phetcommon/js/model/Bucket.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import PlayObject from './PlayObject.js';
import PlayObjectType from './PlayObjectType.js';

// constants
const BUCKET_SIZE = NumberPlayConstants.BUCKET_SIZE;
const PLAY_OBJECT_SIZE = new Dimension2( 40, 40 );
const ANIMATION_SPEED = 200; // in screen coordinates per second
const MAX_ANIMATION_TIME = 1; // in seconds
const MIN_PLAY_OBJECT_SEPARATION = 14;

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
   * @param {BooleanProperty} isResetting
   */
  constructor( currentNumberProperty, objectMaxScale, isResettingProperty, options ) {

    options = merge( {
      bucketPosition: Vector2.ZERO, // {Vector2}
      organizedObjectPadding: null, // {null|Vector2} - see calculateOrganizedPlayObjectSpots for doc
      playObjectTypeProperty: null  // see this.playObjectTypeProperty for doc - created if not provided
    }, options );

    assert && assert( currentNumberProperty.range, `Range is required: ${currentNumberProperty.range}` );

    // @public
    this.currentNumberProperty = currentNumberProperty;

    // @public (read-only)
    this.bucket = new Bucket( {
      baseColor: NumberPlayConstants.BUCKET_BASE_COLOR,
      size: BUCKET_SIZE,
      position: options.bucketPosition
    } );

    // @public {EnumerationProperty.<PlayObjectType|ComparePlayObjectType>} - the current type of playObject being displayed
    if ( options.playObjectTypeProperty ) {
      this.playObjectTypeProperty = options.playObjectTypeProperty;
    }
    else {
      this.playObjectTypeProperty = new EnumerationProperty( PlayObjectType, PlayObjectType.DOG );
    }

    const initialSpots = [
      new Vector2( -BUCKET_SIZE.width * 0.25, BUCKET_SIZE.height * 0.75 ).plus( this.bucket.position ),
      new Vector2( 0, BUCKET_SIZE.height ).plus( this.bucket.position ),
      new Vector2( BUCKET_SIZE.width * 0.25, BUCKET_SIZE.height * 0.75 ).plus( this.bucket.position )
    ];
    let spotIndex = 0;

    // @public (read-only) - all of the playObjects being managed
    this.playObjects = [];
    _.times( currentNumberProperty.range.max, () => {
      this.playObjects.push( new PlayObject(
        this.playObjectTypeProperty,
        initialSpots[ spotIndex ].copy(),
        PLAY_OBJECT_SIZE,
        objectMaxScale
      ) );

      ++spotIndex;
      if ( spotIndex > initialSpots.length - 1 ) {
        spotIndex = 0;
      }
    } );

    // if organizedObjectPadding is provided, calculate the spots for
    if ( options.organizedObjectPadding ) {

      // @private {Vector2[]}
      this.organizedPlayObjectSpots = this.calculateOrganizedPlayObjectSpots( objectMaxScale, options.organizedObjectPadding );
    }

    // @private - all playObjects that are currently in the play area
    this.playObjectsInPlayArea = new ObservableArray();

    // @public {boolean} whether the view of this play area is controlling the current number
    this.isControllingCurrentNumber = false;

    // if the current number changes, add or remove playObjects from the play area
    currentNumberProperty.link( ( currentNumber, previousNumber ) => {
      if ( !this.isControllingCurrentNumber && !isResettingProperty.value ) {
        if ( currentNumber < previousNumber ) {
          _.times( previousNumber - currentNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.playObjectsInPlayArea.lengthProperty.value > currentNumberProperty.range.min ) {
              this.findPlayObjectToReturnToBucket();
            }
          } );
        }
        else if ( currentNumber > previousNumber ) {
          _.times( currentNumber - previousNumber, () => {

            // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
            if ( this.playObjectsInPlayArea.lengthProperty.value < currentNumberProperty.range.max ) {
              this.findPlayObjectToAddToPlayArea();
            }
          } );
        }
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
      playObject.animation.finishEmitter.addListener( () => {
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
      playObject.animation.finishEmitter.addListener( () => {
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
      // the added playObject animates out from the bucket and not its previous position in the play area
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
      playObject.animation.finishEmitter.addListener( () => {
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
   * Calculates the spots for organized playObjects
   *
   * @param {number} objectMaxScale - see PlayObject for doc
   * @param {Vector2} organizedObjectPadding - x and y padding for playObjects organized in a grid
   * @returns {Vector2[]}
   * @private
   */
  calculateOrganizedPlayObjectSpots( objectMaxScale, organizedObjectPadding ) {
    const gridWidth = 5; // empirically determined
    const gridHeight = this.playObjects.length / gridWidth;

    const playObjectWidth = PLAY_OBJECT_SIZE.width * objectMaxScale;
    const playObjectHeight = PLAY_OBJECT_SIZE.height * objectMaxScale;
    const yOffset = MAX_ANIMATE_INTO_PLAY_AREA_DISTANCE_Y - ( playObjectHeight * 2 / gridHeight );

    const spots = [];

    // iterate through and store the center point of every spot
    for ( let i = 0; i < gridHeight; i++ ) {
      for ( let j = 0; j < gridWidth; j++ ) {
        spots.push( new Vector2(
          MIN_ANIMATE_INTO_PLAY_AREA_DISTANCE_X + ( ( playObjectWidth + organizedObjectPadding.x ) * j ),
          yOffset - ( ( playObjectHeight + organizedObjectPadding.y ) * i )
        ) );
      }
    }
    return spots;
  }

  /**
   * Organizes the playObjectsInPlayArea in a grid pattern. Can only be called if this.organizedPlayObjectSpots exist.
   *
   * @public
   */
  organizePlayObjects() {

    assert && assert( this.organizedPlayObjectSpots, 'this.organizedPlayObjectSpots must exist to call this function' );

    // copy the current playObjectsInPlayArea so we can mutate it
    let playObjectsToOrganize = [ ...this.playObjectsInPlayArea.getArray() ];
    const numberOfObjectsToOrganize = playObjectsToOrganize.length;

    for ( let i = 0; i < numberOfObjectsToOrganize; i++ ) {
      const destination = this.organizedPlayObjectSpots[ i ];

      // sort the  playObjectToOrganize by closest to the destination
      playObjectsToOrganize = _.sortBy( playObjectsToOrganize, playObject => {
        return playObject.positionProperty.value.distance( destination );
      } );
      const playObjectToOrganize = playObjectsToOrganize.shift();
      playObjectToOrganize.animation && playObjectToOrganize.animation.stop();

      // make sure playObject is at full scale
      playObjectToOrganize.scaleProperty.value = playObjectToOrganize.scaleProperty.range.max;

      // if not already in the destination spot, animate to the destination
      if ( !playObjectToOrganize.positionProperty.value.equals( destination ) ) {

        playObjectToOrganize.animation = new Animation( {
          duration: 0.5,
          property: playObjectToOrganize.positionProperty,
          to: destination,
          easing: Easing.CUBIC_IN_OUT
        } );
        playObjectToOrganize.animation.start();
        playObjectToOrganize.animation.finishEmitter.addListener( () => {
          playObjectToOrganize.animation = null;
        } );
      }
    }
  }

  /**
   * If the provided playObject is too close to any others in the playArea, move it slightly.
   *
   * @param {PlayObject} droppedPlayObject
   * @param {number} droppedPlayObjectMoveCount - if this gets to high, move away in a uniform direction
   */
  checkIfCoveringPlayObject( droppedPlayObject, droppedPlayObjectMoveCount ) {
    const otherPlayObjectsInPlayArea = [ ...this.playObjectsInPlayArea.getArray() ];
    _.pull( otherPlayObjectsInPlayArea, droppedPlayObject );

    // compare to the position of every playObject in the play area except our self
    otherPlayObjectsInPlayArea.forEach( playObject => {
      if ( !playObject.animation &&
           playObject.positionProperty.value.distance( droppedPlayObject.positionProperty.value ) < MIN_PLAY_OBJECT_SEPARATION
      ) {
        let jumpComponent = MIN_PLAY_OBJECT_SEPARATION / Math.sqrt( 2 );
        const jumpXSign = droppedPlayObject.positionProperty.value.x >= playObject.positionProperty.value.x ? 1 : -1;
        const jumpYSign = droppedPlayObject.positionProperty.value.y >= playObject.positionProperty.value.y ? 1 : -1;

        // we're probably stuck in a loop, so increase the jumpComponent length
        if ( droppedPlayObjectMoveCount > 6 ) {
          jumpComponent = jumpComponent * 3;
          droppedPlayObjectMoveCount = 0;
        }

        // animate away and then check to see if we're still covering after we finish animating
        droppedPlayObject.animation && droppedPlayObject.animation.stop();
        droppedPlayObject.animation = new Animation( {
          duration: 0.3,
          property: droppedPlayObject.positionProperty,
          to: droppedPlayObject.positionProperty.value.plusXY( jumpComponent * jumpXSign, jumpComponent * jumpYSign ),
          easing: Easing.CUBIC_IN_OUT
        } );
        droppedPlayObject.animation.start();
        droppedPlayObject.animation.finishEmitter.addListener( () => {
          droppedPlayObject.animation = null;
          this.checkIfCoveringPlayObject( droppedPlayObject, ++droppedPlayObjectMoveCount );
        } );
      }
    } );
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

numberPlay.register( 'ObjectsPlayArea', ObjectsPlayArea );
export default ObjectsPlayArea;
