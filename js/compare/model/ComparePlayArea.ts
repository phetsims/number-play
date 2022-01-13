// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for a ComparePlayArea, which combines a OnesPlayArea and an ObjectsPlayArea.
 *
 * TODO: generalize OnesPlayArea and ObjectsPlayArea so they both aren't needed, see https://github.com/phetsims/number-play/issues/7
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import ComparePlayObjectType from './ComparePlayObjectType.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

class ComparePlayArea {
  public readonly playObjectTypeProperty: EnumerationProperty<ComparePlayObjectType>;
  public readonly onesPlayArea: OnesPlayArea;
  public readonly objectsPlayArea: OnesPlayArea;

  constructor( currentNumberProperty: NumberProperty,
               objectMaxScale: number,
               paperNumberOrigin: Vector2,
               isResettingProperty: BooleanProperty ) {

    // the current type of playObject being displayed
    this.playObjectTypeProperty = new EnumerationProperty( ComparePlayObjectType.DOG );

    // the model for managing paper ones in the playArea
    this.onesPlayArea = new OnesPlayArea( currentNumberProperty, paperNumberOrigin, {
      isResettingProperty: isResettingProperty
    } );

    // the model for managing objects in the playArea
    this.objectsPlayArea = new OnesPlayArea( currentNumberProperty, paperNumberOrigin, {
      isResettingProperty: isResettingProperty
    } );
  }

  /**
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.onesPlayArea.step( dt );
    this.objectsPlayArea.step( dt );
  }

  public reset(): void {
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.playObjectTypeProperty.reset();
  }
}

numberPlay.register( 'ComparePlayArea', ComparePlayArea );
export default ComparePlayArea;