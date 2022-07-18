// Copyright 2019-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim, { SimOptions } from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CompareScreen from './compare/CompareScreen.js';
import NumberPlayGameScreen from './game/NumberPlayGameScreen.js';
import LabScreen from './lab/LabScreen.js';
import numberPlayStrings from './numberPlayStrings.js';
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
import IModel from '../../joist/js/IModel.js';
import ScreenView from '../../joist/js/ScreenView.js';

// get our second locale strings
if ( NumberPlayQueryParameters.secondLocale ) {
  const secondLocaleStrings = phet.chipper.strings[ NumberPlayQueryParameters.secondLocale ];

  if ( secondLocaleStrings ) {
    phet.numberPlay.secondLocaleStrings = secondLocaleStrings;
  }
  else {
    QueryStringMachine.addWarning( 'secondLocale', NumberPlayQueryParameters.secondLocale,
      `Second locale doesn't exist: ${NumberPlayQueryParameters.secondLocale}` );
  }
}

const numberPlayTitleString = numberPlayStrings[ 'number-play' ].title;

const simOptions: SimOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: 'Amanda McGarry',
    softwareDevelopment: 'Chris Klusendorf, Luisa Vargas',
    team: 'Sylvia Celedón-Pattichis, Ariel Paul, Kathy Perkins, Ian Whitacre',
    qualityAssurance: 'Clifford Hardin, Emily Miller, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer',
    thanks: ''
  }
};

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( numberPlayTitleString, [
    new TenScreen( Tandem.ROOT.createTandem( 'tenScreen' ) ),
    new TwentyScreen( Tandem.ROOT.createTandem( 'twentyScreen' ) ),
    new CompareScreen( Tandem.ROOT.createTandem( 'compareScreen' ) ),
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
  if ( NumberPlayQueryParameters.secondLocale ) {
    sim.screenProperty.lazyLink( ( screen: Screen<IModel, ScreenView> ) => {

      if ( numberPlaySpeechSynthesisAnnouncer.initialized && screen.model.isPrimaryLocaleProperty ) {
        numberPlaySpeechSynthesisAnnouncer.updateVoice( screen.model.isPrimaryLocaleProperty.value );
      }
    } );
  }
} );