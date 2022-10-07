// Copyright 2019-2022, University of Colorado Boulder

/**
 * Model class for the 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import createObservableArray, { ObservableArray } from '../../../../axon/js/createObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import TProperty from '../../../../axon/js/TProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';
import numberPlay from '../../numberPlay.js';
import TenFrame from './TenFrame.js';

// constants
const HIGHEST_COUNT = 20;

class LabModel {
  public readonly tenFrames: ObservableArray<TenFrame>;
  public readonly paperNumberPlayArea: OnesPlayArea;
  public readonly dogPlayArea: OnesPlayArea;
  public readonly applePlayArea: OnesPlayArea;
  public readonly butterflyPlayArea: OnesPlayArea;
  public readonly ballPlayArea: OnesPlayArea;
  public readonly selectedTenFrameProperty: TProperty<TenFrame | null>;

  public constructor( tandem: Tandem ) {

    this.tenFrames = createObservableArray();
    this.selectedTenFrameProperty = new Property<TenFrame | null>( null );

    // create five different kinds of play areas
    this.paperNumberPlayArea = new OnesPlayArea(
      HIGHEST_COUNT,
      new BooleanProperty( true ),
      'paperNumberPlayArea', {
        tenFrames: this.tenFrames
      } );
    this.dogPlayArea = new OnesPlayArea(
      HIGHEST_COUNT,
      new BooleanProperty( false ),
      'dogPlayArea', {
        tenFrames: this.tenFrames
      } );
    this.applePlayArea = new OnesPlayArea(
      HIGHEST_COUNT,
      new BooleanProperty( false ),
      'applePlayArea', {
        tenFrames: this.tenFrames
      } );
    this.butterflyPlayArea = new OnesPlayArea(
      HIGHEST_COUNT,
      new BooleanProperty( false ),
      'butterflyPlayArea', {
        tenFrames: this.tenFrames
      } );
    this.ballPlayArea = new OnesPlayArea(
      HIGHEST_COUNT,
      new BooleanProperty( false ),
      'ballPlayArea', {
        tenFrames: this.tenFrames
      } );
  }

  /**
   * Called when the user drags a ten frame from a stack.
   */
  public dragTenFrameFromIcon( tenFrame: TenFrame ): void {
    this.tenFrames.push( tenFrame );
  }

  /**
   * Resets the model.
   */
  public reset(): void {
    this.paperNumberPlayArea.reset();
    this.dogPlayArea.reset();
    this.applePlayArea.reset();
    this.butterflyPlayArea.reset();
    this.ballPlayArea.reset();
    this.tenFrames.clear();
  }
}

numberPlay.register( 'LabModel', LabModel );
export default LabModel;