// Copyright 2019-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import NumberPlayGameScreen from './game/NumberPlayGameScreen.js';
import LabScreen from './lab/LabScreen.js';
import NumberPlayStrings from './NumberPlayStrings.js';
import TenScreen from './ten/TenScreen.js';
import TwentyScreen from './twenty/TwentyScreen.js';
import NumberPlayQueryParameters from './common/NumberPlayQueryParameters.js';
import numberPlaySpeechSynthesisAnnouncer from './common/view/numberPlaySpeechSynthesisAnnouncer.js';
import { Display } from '../../scenery/js/imports.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import audioManager from '../../joist/js/audioManager.js';
import SpeechSynthesisAnnouncer from '../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import Screen from '../../joist/js/Screen.js';
import soundManager from '../../tambo/js/soundManager.js';
import NumberPlayModel from './common/model/NumberPlayModel.js';
import numberPlayPreferences from './common/model/numberPlayPreferences.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import NumberPlayPreferencesNode from './common/view/NumberPlayPreferencesNode.js';
import ReadAloudToggleSwitch from './common/view/ReadAloudToggleSwitch.js';

const numberPlayTitleStringProperty = NumberPlayStrings[ 'number-play' ].titleStringProperty;

const simOptions: SimOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Luisa Vargas',
    team: 'Sylvia Celedón-Pattichis, Ariel Paul, Kathy Perkins, Ian Whitacre',
    qualityAssurance: 'Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer',
    thanks: 'Andrea Barraugh (Math Transformations), Kristin Donley, Bertha Orona'
  },
  preferencesModel: new PreferencesModel( {
    simulationOptions: {
      customPreferences: [ {
        createContent: () => new NumberPlayPreferencesNode()
      } ]
    },
    audioOptions: {
      customPreferences: [ {
        createContent: () => new ReadAloudToggleSwitch( numberPlayPreferences, [ 1, 2 ] )
      } ]
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  if ( QueryStringMachine.containsKey( 'secondLocale' ) && !phet.chipper.strings[ NumberPlayQueryParameters.secondLocale! ] ) {
    QueryStringMachine.addWarning( 'secondLocale', NumberPlayQueryParameters.secondLocale,
      `Second locale doesn't exist: ${NumberPlayQueryParameters.secondLocale}` );
  }

  const sim = new Sim( numberPlayTitleStringProperty, [
    new TenScreen( Tandem.ROOT.createTandem( 'tenScreen' ) ),
    new TwentyScreen( Tandem.ROOT.createTandem( 'twentyScreen' ) ),
    new NumberPlayGameScreen( Tandem.ROOT.createTandem( 'numberPlayGameScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'numberPlayLabScreen' ) )
  ], simOptions );
  sim.start();

  soundManager.setOutputLevelForCategory( 'user-interface', 0 );

  // initialize the SpeechSynthesisAnnouncer that will use speech synthesis to speak numbers
  if ( SpeechSynthesisAnnouncer.isSpeechSynthesisSupported() ) {
    numberPlaySpeechSynthesisAnnouncer.initialize( Display.userGestureEmitter, {

      // specify the Properties that control whether or not output is allowed with speech synthesis
      speechAllowedProperty: new DerivedProperty( [
        sim.isConstructionCompleteProperty,
        sim.browserTabVisibleProperty,
        sim.activeProperty,
        sim.isSettingPhetioStateProperty,
        audioManager.audioEnabledProperty
      ], ( simConstructionComplete, simVisible, simActive, simSettingPhetioState, audioEnabled ) => {
        return simConstructionComplete && simVisible && simActive && !simSettingPhetioState && audioEnabled;
      } )
    } );

    numberPlaySpeechSynthesisAnnouncer.enabledProperty.value = true;
  }

  // Update the speech synthesis voice to match the locale toggle value of the new screen. This is needed because each
  // screen has its own control for the speech synthesis locale, so the locale for the browser tab needs to be updated
  // to match whenever the screen changes.
  sim.selectedScreenProperty.lazyLink( ( screen: Screen ) => {

    if ( numberPlayPreferences.showSecondLocaleProperty.value && screen.model instanceof NumberPlayModel &&
         numberPlaySpeechSynthesisAnnouncer.initialized && screen.model.isPrimaryLocaleProperty ) {
      numberPlaySpeechSynthesisAnnouncer.updateVoice( screen.model.isPrimaryLocaleProperty.value );
    }
  } );
} );