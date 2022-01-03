// Copyright 2019-2021, University of Colorado Boulder

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

class CompareModel {

  /**
   * @param {number} highestCount - the highest integer number that can be counted to
   * @param {Vector2} paperNumberOrigin - see OnesPlayArea for doc
   * @param {number} objectMaxScale - see PlayObject for doc
   * @param {Tandem} tandem
   */
  constructor( highestCount, paperNumberOrigin, objectMaxScale, tandem ) {

    // @public {NumberProperty}
    this.leftCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );
    this.rightCurrentNumberProperty = new NumberProperty( 0, {
      range: new Range( 0, highestCount )
    } );

    // @public {RichEnumerationProperty.<CompareCountingType>}
    this.countingTypeProperty = new RichEnumerationProperty( CompareCountingType, CompareCountingType.BLOCKS );

    // @public {BooleanProperty}
    this.comparisonSignsAndTextVisibleProperty = new BooleanProperty( true );

    // @public {BooleanProperty} - see NumberPlayModel for doc
    this.isResettingProperty = new BooleanProperty( false );

    // @public
    this.leftPlayArea = new ComparePlayArea( this.leftCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
    this.rightPlayArea = new ComparePlayArea( this.rightCurrentNumberProperty, objectMaxScale, paperNumberOrigin, this.isResettingProperty );
  }

  /**
   * Steps the model.
   * @param {number} dt - time step, in seconds
   * @public
   */
  step( dt ) {
    this.leftPlayArea.step( dt );
    this.rightPlayArea.step( dt );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
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