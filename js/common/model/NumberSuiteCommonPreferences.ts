// Copyright 2022, University of Colorado Boulder

/**
 * NumberSuiteCommonPreferences is the model for sim-specific preferences for all Number suite sims, accessed via the
 * Preferences dialog. These preferences are global, and affect all screens.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayQueryParameters from '../NumberPlayQueryParameters.js';
import StringProperty from '../../../../axon/js/StringProperty.js';
import Property from '../../../../axon/js/Property.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import IntentionalAny from '../../../../phet-core/js/types/IntentionalAny.js';

abstract class NumberSuiteCommonPreferences {
  public readonly readAloudProperty: Property<boolean>;
  public readonly showSecondLocaleProperty: Property<boolean>;
  public readonly secondLocaleProperty: StringProperty;
  public readonly showLabOnesProperty: Property<boolean>;
  public readonly secondLocaleStringsProperty: TReadOnlyProperty<IntentionalAny>;

  protected constructor() {
    this.readAloudProperty = new BooleanProperty( NumberPlayQueryParameters.readAloud );
    this.secondLocaleProperty = new StringProperty( NumberPlayQueryParameters.secondLocale! );

    // if a valid second locale was provided, display the second locale on sim startup
    this.showSecondLocaleProperty = new BooleanProperty( QueryStringMachine.containsKey( 'secondLocale' ) &&
                                                         !!phet.chipper.strings[ NumberPlayQueryParameters.secondLocale! ] );

    this.secondLocaleStringsProperty = new DerivedProperty( [ this.secondLocaleProperty ], secondLocale => {
      return phet.chipper.strings[ secondLocale ];
    } );
    this.showLabOnesProperty = new BooleanProperty( NumberPlayQueryParameters.showLabOnes );
  }
}

numberPlay.register( 'NumberSuiteCommonPreferences', NumberSuiteCommonPreferences );
export default NumberSuiteCommonPreferences;