// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import Range from '../../../../dot/js/Range.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from './OnesPlayArea.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';

class NumberPlayModel {

  public readonly currentNumberProperty: NumberProperty;
  public readonly isResettingProperty: BooleanProperty;
  public readonly groupingLinkingTypeProperty: EnumerationProperty<GroupingLinkingType>;
  public readonly onesPlayArea: OnesPlayArea;
  public readonly objectsPlayArea: OnesPlayArea;
  public readonly isPrimaryLocaleProperty: BooleanProperty;

  constructor( highestCount: number, tandem: Tandem ) {

    // the current "counted to" number, which is the central aspect of this whole sim
    this.currentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );

    // whether the sim is using the locale it was loaded in or a second locale
    this.isPrimaryLocaleProperty = new BooleanProperty( true );

    // true when the sim is being reset. this is used so that playAreas don't return things to their buckets the normal
    // way (with animations), but instead with a different reset case (no animations).
    this.isResettingProperty = new BooleanProperty( false );

    // whether the ones and objects play areas are ungrouped, grouped, or linked
    this.groupingLinkingTypeProperty = new EnumerationProperty( GroupingLinkingType.UNGROUPED );

    // the model for managing the play area in the OnesAccordionBox
    this.onesPlayArea = new OnesPlayArea( this.currentNumberProperty, {
      isResettingProperty: this.isResettingProperty
    } );

    // the model for managing the play area in the ObjectsAccordionBox
    this.objectsPlayArea = new OnesPlayArea( this.currentNumberProperty, {
      isResettingProperty: this.isResettingProperty,
      isOnes: false
    } );
  }

  /**
   * Steps the model.
   * @param dt - in seconds
   */
  public step( dt: number ): void {
    this.onesPlayArea.step( dt );
    this.objectsPlayArea.step( dt );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isResettingProperty.value = true;
    this.groupingLinkingTypeProperty.reset();
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.currentNumberProperty.reset();
    this.isResettingProperty.value = false;
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;