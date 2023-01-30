// Copyright 2022-2023, University of Colorado Boulder

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
import NumberSuiteCommonPreferences from '../../../../number-suite-common/js/common/model/NumberSuiteCommonPreferences.js';
import numberPlay from '../../numberPlay.js';

export class NumberPlayPreferences extends NumberSuiteCommonPreferences {
  public readonly subitizeTimeShownProperty: NumberProperty;

  public constructor() {
    super( 'https://phet.colorado.edu/sims/html/number-play/latest/number-play_all.html' );

    this.subitizeTimeShownProperty = new NumberProperty( NumberPlayQueryParameters.subitizeTimeShown, {
      range: new Range( NumberPlayConstants.MIN_SHAPE_VISIBLE_TIME, NumberPlayConstants.MAX_SHAPE_VISIBLE_TIME )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

const numberPlayPreferences = new NumberPlayPreferences();
numberPlay.register( 'numberPlayPreferences', numberPlayPreferences );
export default numberPlayPreferences;