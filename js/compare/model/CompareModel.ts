// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for the 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RichEnumerationProperty from '../../../../axon/js/RichEnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import numberPlay from '../../numberPlay.js';
import CompareCountingType from './CompareCountingType.js';
import ComparePlayArea from './ComparePlayArea.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';

class CompareModel {
  public readonly leftCurrentNumberProperty: NumberProperty;
  public readonly rightCurrentNumberProperty: NumberProperty;
  public readonly countingTypeProperty: RichEnumerationProperty<CompareCountingType>;
  public readonly comparisonSignsAndTextVisibleProperty: BooleanProperty;
  private readonly isResettingProperty: BooleanProperty;
  public readonly leftPlayArea: ComparePlayArea;
  public readonly rightPlayArea: ComparePlayArea;

  constructor( highestCount: number, paperNumberOrigin: Vector2, objectMaxScale: number, tandem: Tandem ) {

    this.leftCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );
    this.rightCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );
    this.countingTypeProperty = new RichEnumerationProperty( CompareCountingType.BLOCKS );
    this.comparisonSignsAndTextVisibleProperty = new BooleanProperty( true );
    this.isResettingProperty = new BooleanProperty( false );

    this.leftPlayArea = new ComparePlayArea( this.leftCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
    this.rightPlayArea = new ComparePlayArea( this.rightCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
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
    this.comparisonSignsAndTextVisibleProperty.reset();
    this.countingTypeProperty.reset();
    this.isResettingProperty.reset();
  }
}

numberPlay.register( 'CompareModel', CompareModel );
export default CompareModel;