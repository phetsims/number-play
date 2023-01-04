// Copyright 2019-2022, University of Colorado Boulder

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

class NumberPlayModel implements TModel {

  public readonly sumRange: Range;
  public readonly currentNumberProperty: TProperty<number>;
  public readonly isPrimaryLocaleProperty: BooleanProperty;
  public readonly onesPlayArea: CountingPlayArea;
  public readonly objectsPlayArea: CountingPlayArea;
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly groupAndLinkTypeProperty: EnumerationProperty<GroupAndLinkType>;
  private readonly isResettingProperty: BooleanProperty;
  private readonly groupingEnabledProperty: TReadOnlyProperty<boolean>;

  protected constructor( highestCount: number, tandem: Tandem ) {

    this.sumRange = new Range( 0, highestCount );

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
    this.onesPlayArea = new CountingPlayArea( highestCount, new BooleanProperty( true ), 'countingPlayArea' );

    // the model for managing the play area in the ObjectsAccordionBox
    this.objectsPlayArea = new CountingPlayArea( highestCount, this.groupingEnabledProperty, 'objectsPlayArea' );

    let onesLeading = false;
    let objectsLeading = false;

    // the current "counted to" number, which is the central aspect of this whole sim
    this.currentNumberProperty = new NumberProperty( 0 );

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
  }

  private matchPlayAreaToNewValue( newValue: number, oldValue: number, playArea: CountingPlayArea ): void {
    const difference = newValue - oldValue;
    // console.log( `matching ${playArea.name}: oldValue: ${oldValue}, newValue: ${newValue}` );
    if ( difference > 0 ) {
      assert && assert( difference === 1, 'A play area should not need to create more than one counting object' +
                                          'at a time to match the opposite play area: ' + difference );
      playArea.createCountingObjectFromBucket( {
        shouldAnimate: true,
        value: 1
      } );
    }
    else {
      _.times( Math.abs( difference ), () => {
        playArea.returnCountingObjectToBucket();
      } );
    }
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isResettingProperty.value = true;
    this.isPrimaryLocaleProperty.reset();
    this.countingObjectTypeProperty.reset();
    this.groupAndLinkTypeProperty.reset();
    this.onesPlayArea.reset();
    this.objectsPlayArea.reset();
    this.isResettingProperty.value = false;
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;