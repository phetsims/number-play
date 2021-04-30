// Copyright 2019-2020, University of Colorado Boulder

/**
 * Model class for a play object, which is any draggable item in the ObjectsAccordionBox
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import Range from '../../../../dot/js/Range.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import numberPlay from '../../numberPlay.js';
import PlayObjectGroup from './PlayObjectGroup.js';

class PlayObject {

  /**
   * @param {EnumerationProperty.<PlayObjectType>} playObjectTypeProperty
   * @param {Vector2} initialPosition
   * @param {Dimension2} size
   * @param {number} objectMaxScale - the max scale this play object can be increased by
   */
  constructor( playObjectTypeProperty, initialPosition, size, objectMaxScale ) {

    // @public {EnumerationProperty.<PlayObjectType>}
    this.playObjectTypeProperty = playObjectTypeProperty;

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

    // public (read-only) {PlayObjectGroup|null}
    this.playObjectGroup = null;
  }

  /**
   * @param {PlayObjectGroup} playObjectGroup
   * @public
   */
  setPlayObjectGroup( playObjectGroup ) {
    assert && assert ( this.playObjectGroup === null, 'playObjectGroup is already set' );
    assert && assert ( playObjectGroup instanceof PlayObjectGroup, 'not a valid PlayObjectGroup' );
    this.playObjectGroup = playObjectGroup;
  }

  /**
   * @public
   */
  removePlayObjectGroup() {
    this.playObjectGroup = null;
  }

  sendToGroupSpot() {
    assert && assert ( this.playObjectGroup, 'no playObjectGroup found' );
    this.playObjectGroup.sendPlayObjectToSpot( this );
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

numberPlay.register( 'PlayObject', PlayObject );
export default PlayObject;