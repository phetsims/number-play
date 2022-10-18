// Copyright 2022, University of Colorado Boulder

/**
 * NumberPlayPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberPlayQueryParameters from '../NumberPlayQueryParameters.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import NumberSuiteCommonPreferences from './NumberSuiteCommonPreferences.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import numberPlay from '../../numberPlay.js';

export class NumberPlayPreferences extends NumberSuiteCommonPreferences {
  public readonly showCountingLevelOneProperty: LinkableProperty<boolean>;
  public readonly showCountingLevelTwoProperty: LinkableProperty<boolean>;
  public readonly showSubitizeLevelOneProperty: LinkableProperty<boolean>;
  public readonly showSubitizeLevelTwoProperty: LinkableProperty<boolean>;
  public readonly gameLevelsProperty: TReadOnlyProperty<number[]>;
  public readonly subitizeTimeShownProperty: NumberProperty;

  public constructor() {
    super();

    this.showCountingLevelOneProperty = new BooleanProperty( NumberPlayQueryParameters.gameLevels.includes( 1 ) );
    this.showCountingLevelTwoProperty = new BooleanProperty( NumberPlayQueryParameters.gameLevels.includes( 2 ) );
    this.showSubitizeLevelOneProperty = new BooleanProperty( NumberPlayQueryParameters.gameLevels.includes( 3 ) );
    this.showSubitizeLevelTwoProperty = new BooleanProperty( NumberPlayQueryParameters.gameLevels.includes( 4 ) );

    this.gameLevelsProperty = new DerivedProperty( [ this.showCountingLevelOneProperty, this.showCountingLevelTwoProperty,
      this.showSubitizeLevelOneProperty, this.showSubitizeLevelTwoProperty ], ( showCountingLevelOne, showCountingLevelTwo,
                                                                                showSubitizeLevelOne, showSubitizeLevelTwo ) => {
      const gameLevelsVisible = [ showCountingLevelOne, showCountingLevelTwo, showSubitizeLevelOne, showSubitizeLevelTwo ];
      const includedLevelNumbers: number[] = [];
      gameLevelsVisible.forEach( ( gameLevelVisible, index ) => {
        gameLevelVisible && includedLevelNumbers.push( index + 1 );
      } );
      return includedLevelNumbers;
    } );

    this.subitizeTimeShownProperty = new NumberProperty( NumberPlayQueryParameters.subitizeTimeShown, {
      range: new Range( NumberPlayConstants.MIN_SHAPE_VISIBLE_TIME, NumberPlayConstants.MAX_SHAPE_VISIBLE_TIME )
    } );
  }
}

const numberPlayPreferences = new NumberPlayPreferences();
numberPlay.register( 'numberPlayPreferences', numberPlayPreferences );
export default numberPlayPreferences;