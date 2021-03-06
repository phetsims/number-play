// Copyright 2019-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CompareScreen from './compare/CompareScreen.js';
import GameScreen from './game/GameScreen.js';
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

// launch the sim - beware that scenery Image nodes created outside of simLauncher.launch() will have zero bounds
// until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
simLauncher.launch( () => {
  const sim = new Sim( numberPlayTitleString, [
    new TenScreen( Tandem.ROOT.createTandem( 'tenScreen' ) ),
    new TwentyScreen( Tandem.ROOT.createTandem( 'twentyScreen' ) ),
    new CompareScreen( Tandem.ROOT.createTandem( 'compareScreen' ) ),
    new GameScreen( Tandem.ROOT.createTandem( 'gameScreen' ) ),
    new LabScreen( Tandem.ROOT.createTandem( 'labScreen' ) )
  ], simOptions );
  sim.start();
} );