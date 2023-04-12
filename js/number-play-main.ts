// Copyright 2019-2023, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import NumberPlayGameScreen from './game/NumberPlayGameScreen.js';
import LabScreen from '../../number-suite-common/js/lab/LabScreen.js';
import NumberPlayStrings from './NumberPlayStrings.js';
import TenScreen from './ten/TenScreen.js';
import TwentyScreen from './twenty/TwentyScreen.js';
import numberPlaySpeechSynthesisAnnouncer from './common/view/numberPlaySpeechSynthesisAnnouncer.js';
import { Display } from '../../scenery/js/imports.js';
import DerivedProperty from '../../axon/js/DerivedProperty.js';
import audioManager from '../../joist/js/audioManager.js';
import SpeechSynthesisAnnouncer from '../../utterance-queue/js/SpeechSynthesisAnnouncer.js';
import soundManager from '../../tambo/js/soundManager.js';
import numberPlayPreferences from './common/model/numberPlayPreferences.js';
import PreferencesModel from '../../joist/js/preferences/PreferencesModel.js';
import NumberPlayPreferencesNode from './common/view/NumberPlayPreferencesNode.js';
import AutoHearControl from '../../number-suite-common/js/common/view/AutoHearControl.js';
import NumberSuiteCommonPreferencesNode from '../../number-suite-common/js/common/view/NumberSuiteCommonPreferencesNode.js';
import numberPlayUtteranceQueue from './common/view/numberPlayUtteranceQueue.js';
import LanguageAndVoiceControl from '../../number-suite-common/js/common/view/LanguageAndVoiceControl.js';
import localeProperty from '../../joist/js/i18n/localeProperty.js';
import MathSymbols from '../../scenery-phet/js/MathSymbols.js';

const numberPlayTitleStringProperty = NumberPlayStrings[ 'number-play' ].titleStringProperty;
const LAB_SCREEN_SYMBOLS = [ MathSymbols.EQUAL_TO, MathSymbols.PLUS, MathSymbols.MINUS ];

const simOptions: SimOptions = {
  credits: {
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Luisa Vargas',
    team: 'Catherine Carter, Sylvia Celedón-Pattichis, Michael Kauzmann, Chris Malley (PixelZoom, Inc.), Ariel Paul, Kathy Perkins, Marla Schulz, Ian Whitacre',
    qualityAssurance: 'Jaron Droder, Clifford Hardin, Emily Miller, Nancy Salpepi, Martin Veillette, Kathryn Woessner',
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
        createContent: () => new AutoHearControl(
          numberPlayPreferences,
          numberPlaySpeechSynthesisAnnouncer,
          NumberPlayStrings.automaticallyHearTotalStringProperty,
          NumberPlayStrings.automaticallyHearTotalDescriptionStringProperty,
          NumberSuiteCommonPreferencesNode.hasScreenType( TenScreen ) || NumberSuiteCommonPreferencesNode.hasScreenType( TwentyScreen ) )
      } ]
    },
    localizationOptions: {
      includeLocalePanel: false,
      customPreferences: [ {
        createContent: () => new LanguageAndVoiceControl(
          localeProperty,
          numberPlayPreferences.primaryVoiceProperty,
          numberPlayUtteranceQueue
        )
      } ]
    }
  } )
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {

  const sim = new Sim( numberPlayTitleStringProperty, [
    new TenScreen( Tandem.ROOT.createTandem( 'tenScreen' ) ),
    new TwentyScreen( Tandem.ROOT.createTandem( 'twentyScreen' ) ),
    new NumberPlayGameScreen( Tandem.ROOT.createTandem( 'numberPlayGameScreen' ) ),
    new LabScreen( LAB_SCREEN_SYMBOLS, numberPlayPreferences, Tandem.ROOT.createTandem( 'numberPlayLabScreen' ) )
  ], simOptions );
  sim.start();

  soundManager.setOutputLevelForCategory( 'user-interface', 0 );

  // initialize the SpeechSynthesisAnnouncers that will use speech synthesis for general sim use and setting preferences
  if ( SpeechSynthesisAnnouncer.isSpeechSynthesisSupported() ) {
    numberPlaySpeechSynthesisAnnouncer.initialize( Display.userGestureEmitter, {

      // specify the Properties that control whether output is allowed with speech synthesis
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

  numberPlayUtteranceQueue.initialize( sim.selectedScreenProperty );
} );