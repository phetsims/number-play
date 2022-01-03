// Copyright 2019-2021, University of Colorado Boulder

/**
 * Model class for a ComparePlayArea, which combines a OnesPlayArea and an ObjectsPlayArea.
 *
 * TODO: generalize OnesPlayArea and ObjectsPlayArea so they both aren't needed, see https://github.com/phetsims/number-play/issues/7
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import RichEnumerationProperty from '../../../../axon/js/RichEnumerationProperty.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import ComparePlayObjectType from './ComparePlayObjectType.js';

class ComparePlayArea {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
   * @param {BooleanProperty} isResetting
   */
  constructor( currentNumberProperty, objectMaxScale, paperNumberOrigin, isResettingProperty ) {

    // @public {RichEnumerationProperty.<ComparePlayObjectType>} - the current type of playObject being displayed
    this.playObjectTypeProperty = new RichEnumerationProperty( ComparePlayObjectType, ComparePlayObjectType.DOG );

    // @public (read-only) - the model for managing paper ones in the playArea
    this.onesPlayArea = new OnesPlayArea( currentNumberProperty, paperNumberOrigin, {
      isResettingProperty: isResettingProperty
    } );

    // @public (read-only) - the model for managing objects in the playArea
    this.objectsPlayArea = new OnesPlayArea( currentNumberProperty, paperNumberOrigin, {
      isResettingProperty: isResettingProperty
    } );
  }

  /**
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.onesPlayArea.step( dt );
    this.objectsPlayArea.step( dt );
  }

  /**
   * @public
   */
  reset() {
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.playObjectTypeProperty.reset();
  }
}

numberPlay.register( 'ComparePlayArea', ComparePlayArea );
export default ComparePlayArea;