// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from './CompareCountingType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';

class CompareModel {
  public readonly leftCurrentNumberProperty: NumberProperty;
  public readonly rightCurrentNumberProperty: NumberProperty;
  public readonly countingTypeProperty: EnumerationProperty<CompareCountingType>;
  public readonly comparisonSignsAndTextVisibleProperty: BooleanProperty;
  private readonly isResettingProperty: BooleanProperty;
  public readonly leftPlayArea: OnesPlayArea;
  public readonly rightPlayArea: OnesPlayArea;
  public readonly isPrimaryLocaleProperty: BooleanProperty;
  public readonly leftCountingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly rightCountingObjectTypeProperty: EnumerationProperty<CountingObjectType>;

  constructor( highestCount: number, tandem: Tandem ) {

    this.leftCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );
    this.leftCountingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    this.rightCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );
    this.rightCountingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    this.countingTypeProperty = new EnumerationProperty( CompareCountingType.BLOCKS );
    this.comparisonSignsAndTextVisibleProperty = new BooleanProperty( true );
    this.isResettingProperty = new BooleanProperty( false );

    // whether the sim is using the locale it was loaded in or a second locale
    this.isPrimaryLocaleProperty = new BooleanProperty( true );

    // create the left and right play areas
    this.leftPlayArea = new OnesPlayArea(
      this.leftCurrentNumberProperty,
      new BooleanProperty( true ), {
        isResettingProperty: this.isResettingProperty
      } );
    this.rightPlayArea = new OnesPlayArea(
      this.rightCurrentNumberProperty,
      new BooleanProperty( true ), {
        isResettingProperty: this.isResettingProperty
      } );
  }

  /**
   * Steps the model.
   * @param dt - time step, in seconds
   */
  public step( dt: number ): void {
    this.leftPlayArea.step( dt );
    this.rightPlayArea.step( dt );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isResettingProperty.value = true;
    this.leftPlayArea.reset();
    this.rightPlayArea.reset();
    this.leftCurrentNumberProperty.reset();
    this.rightCurrentNumberProperty.reset();
    this.rightCountingObjectTypeProperty.reset();
    this.leftCountingObjectTypeProperty.reset();
    this.comparisonSignsAndTextVisibleProperty.reset();
    this.countingTypeProperty.reset();
    this.isResettingProperty.value = false;
  }
}

numberPlay.register( 'CompareModel', CompareModel );
export default CompareModel;