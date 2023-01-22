// Copyright 2022-2023, University of Colorado Boulder

/**
 * NumberPlayPreferencesNode is the user interface for sim-specific preferences for Number Play, accessed via the
 * Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import numberPlay from '../../numberPlay.js';
import NumberSuiteCommonPreferencesNode from '../../../../number-suite-common/js/common/view/NumberSuiteCommonPreferencesNode.js';
import { NumberPlayPreferences } from '../model/numberPlayPreferences.js';
import NumberPlayGameScreen from '../../game/NumberPlayGameScreen.js';
import TenScreen from '../../ten/TenScreen.js';
import TwentyScreen from '../../twenty/TwentyScreen.js';
import SubitizeTimeControl from './SubitizeTimeControl.js';

export default class NumberPlayPreferencesNode extends NumberSuiteCommonPreferencesNode<NumberPlayPreferences> {

  public constructor( preferences: NumberPlayPreferences ) {

    const subitizeTimeControl = new SubitizeTimeControl( preferences.subitizeTimeShownProperty, {
      enabled: NumberSuiteCommonPreferencesNode.hasScreenType( NumberPlayGameScreen )
    } );

    super( preferences, [ subitizeTimeControl ], {
      secondLanguageControlEnabled: NumberSuiteCommonPreferencesNode.hasScreenType( TenScreen ) ||
                                    NumberSuiteCommonPreferencesNode.hasScreenType( TwentyScreen )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'NumberPlayPreferencesNode', NumberPlayPreferencesNode );