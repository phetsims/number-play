// Copyright 2019-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import voicingManager from '../../scenery/js/accessibility/voicing/voicingManager.js';
import Tandem from '../../tandem/js/Tandem.js';
import CompareScreen from './compare/CompareScreen.js';
import LabScreen from './lab/LabScreen.js';
import numberPlayStrings from './numberPlayStrings.js';
import TenScreen from './ten/TenScreen.js';
import TwentyScreen from './twenty/TwentyScreen.js';

const numberPlayTitleString = numberPlayStrings[ 'number-play' ].title;

const simOptions = {
  credits: {
    //TODO fill in credits, all of these fields are optional, see joist.CreditsNode
    leadDesign: '',
    softwareDevelopment: '',
    team: '',
    qualityAssurance: '',
    graphicArts: '',
    soundDesign: '',
    thanks: ''
  }
};

// This sim makes a rare usage of Speech Synthesis without the voicing feature. The voicingManager makes requests
// to the browser to speak content using Speech Synthesis, but is generally disabled until requested by the user.
// Since this sim doesn't support other "Voicing" features (Toolbar, ReadingBlocks, levels of verbocity), there is
// no UI to enable it and speech will always happen when the user presses certain buttons in this sim.
voicingManager.enabledProperty.value = true;

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( numberPlayTitleString, [
    new TenScreen( Tandem.ROOT.createTandem( 'tenScreen' ) ),
    new TwentyScreen( Tandem.ROOT.createTandem( 'twentyScreen' ) ),
    new CompareScreen( Tandem.ROOT.createTandem( 'compareScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );