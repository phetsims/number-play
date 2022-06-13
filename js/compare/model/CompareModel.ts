// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from './CompareCountingType.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Range from '../../../../dot/js/Range.js';

class CompareModel {
  public readonly sumRange: Range; // TODO: Factor out base class with NumberPlayModel.js
  public readonly countingTypeProperty: EnumerationProperty<CompareCountingType>;
  public readonly comparisonSignsAndTextVisibleProperty: BooleanProperty;
  public readonly leftPlayArea: OnesPlayArea;
  public readonly rightPlayArea: OnesPlayArea;
  public readonly isPrimaryLocaleProperty: BooleanProperty;
  public readonly leftCountingObjectTypeProperty: EnumerationProperty<CountingObjectType>;
  public readonly rightCountingObjectTypeProperty: EnumerationProperty<CountingObjectType>;

  constructor( highestCount: number, tandem: Tandem ) {

    this.sumRange = new Range( 0, highestCount );

    this.leftCountingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );
    this.rightCountingObjectTypeProperty = new EnumerationProperty( CountingObjectType.DOG );

    this.countingTypeProperty = new EnumerationProperty( CompareCountingType.BLOCKS );
    this.comparisonSignsAndTextVisibleProperty = new BooleanProperty( true );

    // whether the sim is using the locale it was loaded in or a second locale
    this.isPrimaryLocaleProperty = new BooleanProperty( 'hello!' );

    // create the left and right play areas
    this.leftPlayArea = new OnesPlayArea( highestCount, new BooleanProperty( 'hi!' ), 'leftPlayArea' );
    this.rightPlayArea = new OnesPlayArea( highestCount, new BooleanProperty( true ), 'rightPlayArea' );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.isPrimaryLocaleProperty.reset();
    this.leftPlayArea.reset();
    this.rightPlayArea.reset();
    this.rightCountingObjectTypeProperty.reset();
    this.leftCountingObjectTypeProperty.reset();
    this.comparisonSignsAndTextVisibleProperty.reset();
    this.countingTypeProperty.reset();
  }
}

numberPlay.register( 'CompareModel', CompareModel );
export default CompareModel;