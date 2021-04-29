// Copyright 2021, University of Colorado Boulder

/**
 * Model class for a play object group, which is a movable container for playObjects
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray from '../../../../axon/js/createObservableArray.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import numberPlay from '../../numberPlay.js';

class PlayObjectGroup {

  /**
   * @param {PlayObject} initialPlayObject
   */
  constructor( initialPlayObject ) {

    // @public {Vector2Property}
    this.positionProperty = new Vector2Property( initialPlayObject.positionProperty.value );

    // @public {BooleanProperty}
    this.userControlledProperty = new BooleanProperty( false );

    // @public {null|Animation} - store any animations for this group so we can check if one is still running
    this.animation = null;

    // @public (read-only) {Dimension2}
    this.size = new Dimension2( 70, 50 );

    // @public (read-only) {ObservableArrayDef.<PlayObject>}
    this.playObjects = createObservableArray();

    this.add( initialPlayObject );
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
  }

  /**
   * @param {PlayObject} playObject
   * @public
   */
  remove( playObject ) {
    playObject.removePlayObjectGroup();
    this.playObjects.remove( playObject );
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