// Copyright 2019-2025, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Disposable from '../../../../axon/js/Disposable.js';
import Emitter from '../../../../axon/js/Emitter.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import TEmitter from '../../../../axon/js/TEmitter.js';
import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Range from '../../../../dot/js/Range.js';
import TModel from '../../../../joist/js/TModel.js';
import CountingArea from '../../../../number-suite-common/js/common/model/CountingArea.js';
import GroupAndLinkType from '../../../../number-suite-common/js/common/model/GroupAndLinkType.js';
import NumberSuiteCommonConstants from '../../../../number-suite-common/js/common/NumberSuiteCommonConstants.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import numberPlay from '../../numberPlay.js';
import numberPlayPreferences from './numberPlayPreferences.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';

class NumberPlayModel implements TModel {

  public readonly sumRange: Range;

  // the current "counted to" number, which is the central aspect of this whole sim
  public readonly currentNumberProperty: Property<number>;

  // the model for managing the countingArea in the OnesAccordionBox
  public readonly onesCountingArea: CountingArea;

  // the model for managing the countingArea in the ObjectsAccordionBox
  public readonly objectsCountingArea: CountingArea;

  // the type of objects in the objectsCountingArea. primarily used in the view.
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;

  // whether the objectsCountingArea is ungrouped, grouped, or linked. set by the view controls and used to link/unlink
  // onesCountingArea and objectsCountingArea, and grouped/ungroup objects in the objectsCountingArea
  public readonly objectsGroupAndLinkTypeProperty: EnumerationProperty<GroupAndLinkType>;

  // emits when the objectsCountingArea becomes linked or unlinked to the onesCountingArea
  public readonly linkStatusChangedEmitter: TEmitter<[ boolean ]>;

  // true when the sim is being reset. this is used so that countingAreas don't return things to their creatorNodes the normal
  // way (with animations), but instead with a different reset case (no animations).
  private readonly isResettingProperty: TProperty<boolean>;

  // whether counting objects should be grouped or ungrouped
  private readonly groupingEnabledProperty: TReadOnlyProperty<boolean>;

  protected constructor( highestCount: number, speechDataProperty: TProperty<string>, tandem: Tandem ) {

    this.sumRange = new Range( 0, highestCount );

    this.isResettingProperty = new BooleanProperty( false );

    this.countingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    this.objectsGroupAndLinkTypeProperty = new EnumerationProperty( GroupAndLinkType.UNGROUPED );

    this.linkStatusChangedEmitter = new Emitter( { parameters: [ { valueType: 'boolean' } ] } );

    this.groupingEnabledProperty = new DerivedProperty( [ this.objectsGroupAndLinkTypeProperty ], groupAndLinkType => {
      return ( groupAndLinkType === GroupAndLinkType.GROUPED || groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED );
    } );

    this.onesCountingArea = new CountingArea( highestCount, new BooleanProperty( true ) );

    this.objectsCountingArea = new CountingArea( highestCount, this.groupingEnabledProperty );

    let onesLeading = false;
    let objectsLeading = false;

    this.currentNumberProperty = new NumberProperty( 0 );

    // Update the speechDataProperty when the currentNumber, isPrimaryLocale, primaryLocale, secondaryLocale changes.
    const internalSpeechDataProperty: TReadOnlyProperty<string> = new DynamicProperty( new DerivedProperty( [
      this.currentNumberProperty,
      numberPlayPreferences.isPrimaryLocaleProperty,
      numberPlayPreferences.secondLocaleProperty
    ], ( currentNumber, isPrimaryLocale, secondLocale ) => {
      return NumberSuiteCommonConstants.numberToWordProperty( secondLocale, currentNumber, isPrimaryLocale );
    } ) );

    internalSpeechDataProperty.link( speechData => {
      speechDataProperty.value = speechData;
    } );

    // Update the currentNumberProperty and objectsCountingArea when the onesCountingArea sum changes.
    this.onesCountingArea.sumProperty.lazyLink( ( sum, oldSum ) => {
      if ( !objectsLeading ) {
        assert && assert( !onesLeading, 'onesLeading already true, reentrant detected' );
        onesLeading = true;

        this.currentNumberProperty.value = sum;
        this.matchCountingAreaToNewValue( sum, oldSum, this.objectsCountingArea );

        onesLeading = false;
      }
    } );

    // Update the currentNumberProperty and onesCountingArea when the objectsCountingArea sum changes.
    this.objectsCountingArea.sumProperty.lazyLink( ( sum, oldSum ) => {
      if ( !onesLeading ) {
        assert && assert( !objectsLeading, 'objectsLeading already true, reentrant detected' );
        objectsLeading = true;

        this.currentNumberProperty.value = sum;
        this.matchCountingAreaToNewValue( sum, oldSum, this.onesCountingArea );

        objectsLeading = false;
      }
    } );
  }

  private matchCountingAreaToNewValue( newValue: number, oldValue: number, countingArea: CountingArea ): void {
    const difference = newValue - oldValue;

    if ( difference > 0 ) {
      assert && assert( difference === 1, 'A countingArea should not need to create more than one counting object' +
                                          'at a time to match the opposite countingArea: ' + difference );
      countingArea.createCountingObjectFromCreatorNode();
    }
    else {
      countingArea.returnCountingObjectToCreatorNode( Math.abs( difference ) );
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
    this.onesCountingArea.reset();
    this.objectsCountingArea.reset();
    this.isResettingProperty.value = false;
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;