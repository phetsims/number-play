// Copyright 2021, University of Colorado Boulder

/**
 * Model class for a play object group, which is a movable container for playObjects
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import numberPlay from '../../numberPlay.js';

// constants
const SPOT_SIZE = new Dimension2( 70, 75 );
const PLAY_OBJECT_OFFSET = 30; // distance that each new object is shifted over from the last object when positioned
const MARGIN_BOTTOM = 16; // extra space on bottom for grabbing
const ANIMATION_SPEED = 100; // in screen coordinates per second

class PlayObjectGroup {

  /**
   * @param {PlayObject} initialPlayObject
   */
  constructor( initialPlayObject ) {

    // PlayObjectGroups are positioned from their upper left corner
    const initialPlayObjectPosition = initialPlayObject.positionProperty.value;
    const initialPosition = new Vector2( initialPlayObjectPosition.x - SPOT_SIZE.width / 2,
      initialPlayObjectPosition.y - SPOT_SIZE.height / 2 );

    // @public {Vector2Property}
    this.positionProperty = new Vector2Property( initialPosition );

    // @public {BooleanProperty}
    this.userControlledProperty = new BooleanProperty( false );

    // @public {null|Animation} - store any animations for this group so we can check if one is still running
    this.animation = null;

    // @public (read-only) {NumberProperty}
    this.widthProperty = new NumberProperty( SPOT_SIZE.width - PLAY_OBJECT_OFFSET );

    // @public (read-only) {number}
    this.height = SPOT_SIZE.height + MARGIN_BOTTOM;

    // @private (read-only) {Dimension2} TODO: this shouldn't be needed, refactor view to not use it?
    this.spotSize = SPOT_SIZE;

    // @public (read-only) {ObservableArrayDef.<PlayObject>}
    this.playObjects = createObservableArray();

    this.add( initialPlayObject );

    // stored play objects should follow the position of their group
    this.positionProperty.link( () => {
      this.updatePositions();
    } );
  }

  /**
   * @returns {number}
   * @public
   */
  get length() {
    return this.playObjects.lengthProperty.value;
  }

  /**
   * @param {PlayObject} playObject
   * @public
   */
  add( playObject ) {
    playObject.setPlayObjectGroup( this );
    this.playObjects.add( playObject );
    this.widthProperty.value = this.widthProperty.value + PLAY_OBJECT_OFFSET;
  }

  /**
   * @param {PlayObject} playObject
   * @public
   */
  remove( playObject ) {
    playObject.removePlayObjectGroup();
    this.playObjects.remove( playObject );
    this.updatePositions();
    this.widthProperty.value = this.widthProperty.value - PLAY_OBJECT_OFFSET;
  }

  /**
   * @public
   */
  clear() {
    this.playObjects.forEach( playObject => {
      playObject.removePlayObjectGroup();
    } );
    this.playObjects.clear();
  }

  /**
   * Updates the positions of the contained playObjects
   * @private
   */
  updatePositions() {
    this.playObjects.forEach( ( playObject, playObjectIndex ) => {
      const localTargetPosition = new Vector2( SPOT_SIZE.width / 2 + playObjectIndex * PLAY_OBJECT_OFFSET, SPOT_SIZE.height / 2 );
      const playAreaTargetPosition = localTargetPosition.plus( this.positionProperty.value );
      playObject.positionProperty.set( playAreaTargetPosition );
    } );
  }

  /**
   * @param {PlayObject} playObject
   * @public
   */
  sendPlayObjectToSpot( playObject ) {
    const playObjectIndex = this.playObjects.indexOf( playObject );
    const localTargetPosition = new Vector2( SPOT_SIZE.width / 2 + playObjectIndex * PLAY_OBJECT_OFFSET, SPOT_SIZE.height / 2 );
    const playAreaTargetPosition = localTargetPosition.plus( this.positionProperty.value );

    if ( !playObject.positionProperty.value.equals( playAreaTargetPosition ) ) {
      assert && assert( !playObject.animation );

      playObject.animation = new Animation( {
        property: playObject.positionProperty,
        to: playAreaTargetPosition,
        easing: Easing.CUBIC_IN_OUT,
        duration: playObject.positionProperty.value.distance( playAreaTargetPosition ) / ANIMATION_SPEED
      } );
      playObject.animation.start();
      playObject.animation.finishEmitter.addListener( () => {
        playObject.animation = null;
      } );
    }
  }

  /**
   * @public
   */

  dispose() {
    this.playObjects.dispose();
    this.positionProperty.dispose();
    this.userControlledProperty.dispose();
  }
}

numberPlay.register( 'PlayObjectGroup', PlayObjectGroup );
export default PlayObjectGroup;