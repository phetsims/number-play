// Copyright 2022, University of Colorado Boulder

/**
 * NumberPlayPreferences is the model for sim-specific preferences, accessed via the Preferences dialog.
 * These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * TODO: Will likely need to be converted to a class in order to extend for Number Compare
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayQueryParameters from '../NumberPlayQueryParameters.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Property from '../../../../axon/js/Property.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

const NumberPlayPreferences = {

  readAloudProperty: new BooleanProperty( NumberPlayQueryParameters.readAloud ),

  secondLocaleProperty: new StringProperty( NumberPlayQueryParameters.secondLocale! ),

  showSecondLocaleProperty: new BooleanProperty( false ),

  includedGameLevelsProperty: new Property<number[]>( NumberPlayQueryParameters.gameLevels ),

  subitizeTimeShownProperty: new NumberProperty( NumberPlayQueryParameters.subitizeTimeShown, {
    range: new Range( NumberPlayConstants.MIN_SHAPE_VISIBLE_TIME, NumberPlayConstants.MAX_SHAPE_VISIBLE_TIME )
  } ),

  showLabOnesProperty: new BooleanProperty( NumberPlayQueryParameters.showLabOnes )
};

numberPlay.register( 'NumberPlayPreferences', NumberPlayPreferences );
export default NumberPlayPreferences;