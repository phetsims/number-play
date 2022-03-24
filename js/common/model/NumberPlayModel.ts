// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from './OnesPlayArea.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import GroupAndLinkType from './GroupAndLinkType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';

class NumberPlayModel {

  public readonly currentNumberProperty: NumberProperty;
  public readonly isPrimaryLocaleProperty: BooleanProperty;
  public readonly isResettingProperty: BooleanProperty;
  public readonly onesPlayArea: OnesPlayArea;
  public readonly objectsPlayArea: OnesPlayArea;
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly groupAndLinkTypeProperty: EnumerationProperty<GroupAndLinkType>;
  private readonly groupingEnabledProperty: IReadOnlyProperty<boolean>;

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

    // the type of objects in the objects play area. primarily used in the view.
    this.countingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    // whether the objects play area is ungrouped, grouped, or linked. set by the view controls and used to
    // link/unlink play areas in the view and drive the grouped/ungrouped state in the model
    this.groupAndLinkTypeProperty = new EnumerationProperty( GroupAndLinkType.UNGROUPED );

    // whether counting objects should be grouped or ungrouped
    this.groupingEnabledProperty = new DerivedProperty( [ this.groupAndLinkTypeProperty ], groupAndLinkType => {
      return ( groupAndLinkType === GroupAndLinkType.GROUPED || groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED );
    } );

    // the model for managing the play area in the OnesAccordionBox
    this.onesPlayArea = new OnesPlayArea(
      this.currentNumberProperty,
      new BooleanProperty( true ), {
        isResettingProperty: this.isResettingProperty
      } );

    // the model for managing the play area in the ObjectsAccordionBox
    this.objectsPlayArea = new OnesPlayArea(
      this.currentNumberProperty,
      this.groupingEnabledProperty, {
        isResettingProperty: this.isResettingProperty
      } );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isResettingProperty.value = true;
    this.countingObjectTypeProperty.reset();
    this.groupAndLinkTypeProperty.reset();
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.currentNumberProperty.reset();
    this.isResettingProperty.value = false;
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;