// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for Number Play. It is used for both the 'Ten' and 'Twenty' screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from './OnesPlayArea.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import GroupAndLinkType from './GroupAndLinkType.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Range from '../../../../dot/js/Range.js';

class NumberPlayModel {

  public readonly sumRange: Range;
  public readonly currentNumberProperty: IReadOnlyProperty<number>;
  public readonly isPrimaryLocaleProperty: BooleanProperty;
  public readonly onesPlayArea: OnesPlayArea;
  public readonly objectsPlayArea: OnesPlayArea;
  public readonly countingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly groupAndLinkTypeProperty: EnumerationProperty<GroupAndLinkType>;
  private readonly isResettingProperty: BooleanProperty;
  private readonly groupingEnabledProperty: IReadOnlyProperty<boolean>;
  private previousCurrentNumber: number;

  constructor( highestCount: number, tandem: Tandem ) {

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
    this.onesPlayArea = new OnesPlayArea( highestCount, new BooleanProperty( true ), 'onesPlayArea' );

    // the model for managing the play area in the ObjectsAccordionBox
    this.objectsPlayArea = new OnesPlayArea( highestCount, this.groupingEnabledProperty, 'objectsPlayArea' );

    this.previousCurrentNumber = 0;

    // the current "counted to" number, which is the central aspect of this whole sim
    this.currentNumberProperty = new DerivedProperty( [ this.onesPlayArea.sumProperty, this.objectsPlayArea.sumProperty ],
      ( onesPlayAreaSum, objectsPlayAreaSum ) => {
        assert && assert( this.sumRange.contains( onesPlayAreaSum ), `Ones play area sum is out of range: ${onesPlayAreaSum}` );
        assert && assert( this.sumRange.contains( objectsPlayAreaSum ), `Objects play area sum is out of range: ${objectsPlayAreaSum}` );

        const oldValue = this.previousCurrentNumber;
        let newValue = oldValue;

        if ( onesPlayAreaSum !== objectsPlayAreaSum && !this.isResettingProperty.value ) {

          if ( oldValue === onesPlayAreaSum ) {
            newValue = objectsPlayAreaSum;
            this.previousCurrentNumber = newValue;
            console.log( 'objectsPlayArea changed to: ' + newValue + ', catching up onesPlayArea' );
            this.matchPlayAreaToNewValue( newValue, oldValue, this.onesPlayArea );
          }
          else if ( oldValue === objectsPlayAreaSum ) {
            newValue = onesPlayAreaSum;
            this.previousCurrentNumber = newValue;
            console.log( 'onesPlayArea changed to: ' + newValue + ', catching up objectsPlayArea' );
            this.matchPlayAreaToNewValue( newValue, oldValue, this.objectsPlayArea );
          }
          else {
            assert && assert( false, 'oldValue should match one of the previous sums: ' + oldValue );
          }
        }
        else {
          console.log( 'sum properties matched, caught up at: ' + newValue );
        }

        return newValue;
      } );
  }

  private matchPlayAreaToNewValue( newValue: number, oldValue: number, playArea: OnesPlayArea ): void {
    const difference = newValue - oldValue;
    if ( difference > 0 ) {
      assert && assert( difference === 1, 'A play area should not need to create more than one counting object' +
                                          'at a time to match the opposite play area: ' + difference );
      playArea.createPaperNumberFromBucket( {
        shouldAnimate: true,
        value: 1
      } );
    }
    else {
      _.times( Math.abs( difference ), () => {
        playArea.returnPaperNumberToBucket();
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
    this.previousCurrentNumber = 0;
    this.isResettingProperty.value = false;
  }
}

numberPlay.register( 'NumberPlayModel', NumberPlayModel );
export default NumberPlayModel;