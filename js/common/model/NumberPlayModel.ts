// Copyright 2019-2023, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlay from '../../numberPlay.js';
import CountingPlayArea from '../../../../number-suite-common/js/common/model/CountingPlayArea.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import GroupAndLinkType from '../../../../number-suite-common/js/common/model/GroupAndLinkType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Range from '../../../../dot/js/Range.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TModel from '../../../../joist/js/TModel.js';
import Property from '../../../../axon/js/Property.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import Emitter from '../../../../axon/js/Emitter.js';
import numberPlayPreferences from './numberPlayPreferences.js';

class NumberPlayModel implements TModel {

  public readonly sumRange: Range;

  // the current "counted to" number, which is the central aspect of this whole sim
  public readonly currentNumberProperty: Property<number>;

  // the model for managing the play area in the OnesAccordionBox
  public readonly onesPlayArea: CountingPlayArea;

  // the model for managing the play area in the ObjectsAccordionBox
  public readonly objectsPlayArea: CountingPlayArea;

  // the type of objects in the objects play area. primarily used in the view.
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;

  // whether the objectsPlayArea is ungrouped, grouped, or linked. set by the view controls and used to link/unlink
  // onesPlayArea and objectsPlayArea, and grouped/ungroup objects in the objectsPlayArea
  public readonly objectsGroupAndLinkTypeProperty: EnumerationProperty<GroupAndLinkType>;

  // emits when the objectsPlayArea becomes linked or unlinked to the onesPlayArea
  public readonly objectsLinkedEmitter: TEmitter<[ boolean ]>;

  // true when the sim is being reset. this is used so that playAreas don't return things to their buckets the normal
  // way (with animations), but instead with a different reset case (no animations).
  private readonly isResettingProperty: TProperty<boolean>;

  // whether counting objects should be grouped or ungrouped
  private readonly groupingEnabledProperty: TReadOnlyProperty<boolean>;

  protected constructor( highestCount: number, speechDataProperty: TProperty<string>, tandem: Tandem ) {

    this.sumRange = new Range( 0, highestCount );

    this.isResettingProperty = new BooleanProperty( false );

    this.countingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    this.objectsGroupAndLinkTypeProperty = new EnumerationProperty( GroupAndLinkType.UNGROUPED );

    this.objectsLinkedEmitter = new Emitter( { parameters: [ { valueType: 'boolean' } ] } );

    this.groupingEnabledProperty = new DerivedProperty( [ this.objectsGroupAndLinkTypeProperty ], groupAndLinkType => {
      return ( groupAndLinkType === GroupAndLinkType.GROUPED || groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED );
    } );

    this.onesPlayArea = new CountingPlayArea( highestCount, new BooleanProperty( true ), 'countingPlayArea' );

    this.objectsPlayArea = new CountingPlayArea( highestCount, this.groupingEnabledProperty, 'objectsPlayArea' );

    let onesLeading = false;
    let objectsLeading = false;

    this.currentNumberProperty = new NumberProperty( 0 );

    // update the speechDataProperty when the current number changes
    this.currentNumberProperty.link( currentNumber => {
      speechDataProperty.value = `${currentNumber}`;
    } );

    this.onesPlayArea.sumProperty.lazyLink( ( sum, oldSum ) => {
      if ( !objectsLeading ) {
        assert && assert( !onesLeading, 'onesLeading already true, reentrant detected' );
        onesLeading = true;

        this.currentNumberProperty.value = sum;
        // console.log( 'countingPlayArea set to ' + sum + ', matching objectsPlayArea' );
        this.matchPlayAreaToNewValue( sum, oldSum, this.objectsPlayArea );

        onesLeading = false;
      }
    } );

    this.objectsPlayArea.sumProperty.lazyLink( ( sum, oldSum ) => {
      if ( !onesLeading ) {
        assert && assert( !objectsLeading, 'objectsLeading already true, reentrant detected' );
        objectsLeading = true;

        this.currentNumberProperty.value = sum;

        // console.log( 'objectsPlayArea set to ' + sum + ', matching countingPlayArea' );
        this.matchPlayAreaToNewValue( sum, oldSum, this.onesPlayArea );

        objectsLeading = false;
      }
    } );

    this.objectsGroupAndLinkTypeProperty.lazyLink( ( groupAndLinkType, previousGroupAndLinkType ) => {
      const objectsLinkedToOnes = groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED;
      const objectsLinkedToOnesPreviously = previousGroupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED;

      if ( objectsLinkedToOnes !== objectsLinkedToOnesPreviously ) {

        this.objectsPlayArea.matchCountingObjectsToLinkedPlayArea(
          this.onesPlayArea.getSerializedCountingObjectsIncludedInSum(),
          this.objectsLinkedEmitter,
          objectsLinkedToOnes,
          groupAndLinkType
        );
      }
    } );
  }

  private matchPlayAreaToNewValue( newValue: number, oldValue: number, playArea: CountingPlayArea ): void {
    const difference = newValue - oldValue;

    // console.log( `matching ${playArea.name}: oldValue: ${oldValue}, newValue: ${newValue}` );
    if ( difference > 0 ) {
      assert && assert( difference === 1, 'A play area should not need to create more than one counting object' +
                                          'at a time to match the opposite play area: ' + difference );
      playArea.createCountingObjectFromCreatorNode();
    }
    else {
      playArea.returnCountingObjectToCreatorNode( Math.abs( difference ) );
    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isResettingProperty.value = true;
    numberPlayPreferences.isPrimaryLocaleProperty.reset();
    this.countingObjectTypeProperty.reset();
    this.objectsGroupAndLinkTypeProperty.reset();
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.isResettingProperty.value = false;
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;