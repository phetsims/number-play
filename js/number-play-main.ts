// Copyright 2019-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CompareScreen from './compare/CompareScreen.js';
import NumberPlayGameScreen from './game/NumberPlayGameScreen.js';
import numberPlayStrings from './numberPlayStrings.js';
import TenScreen from './ten/TenScreen.js';
import TwentyScreen from './twenty/TwentyScreen.js';
import NumberPlayQueryParameters from './common/NumberPlayQueryParameters.js';

// get our
if ( NumberPlayQueryParameters.secondLocale ) {
  const secondLocaleStrings = phet.chipper.strings[ NumberPlayQueryParameters.secondLocale ];

  if ( secondLocaleStrings ) {
    phet.numberPlay.secondLocaleStrings = secondLocaleStrings;
  }
  else {
    // @ts-ignore
    QueryStringMachine.addWarning( 'secondLocale', NumberPlayQueryParameters.secondLocale,
      `Second locale doesn't exist: ${NumberPlayQueryParameters.secondLocale}` );
  }
}

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
    new NumberPlayGameScreen( Tandem.ROOT.createTandem( 'numberPlayGameScreen' ) )
  ], simOptions );
  sim.start();
} );