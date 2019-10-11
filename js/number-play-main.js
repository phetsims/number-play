// Copyright 2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const TenScreen = require( 'NUMBER_PLAY/ten/TenScreen' );
  const TwentyScreen = require( 'NUMBER_PLAY/twenty/TwentyScreen' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const numberPlayTitleString = require( 'string!NUMBER_PLAY/number-play.title' );

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

  // launch the sim - beware that scenery Image nodes created outside of SimLauncher.launch() will have zero bounds
  // until the images are fully loaded, see https://github.com/phetsims/coulombs-law/issues/70
  SimLauncher.launch( () => {
    const sim = new Sim( numberPlayTitleString, [
      new TenScreen( Tandem.rootTandem.createTandem( 'tenScreen' ) ),
      new TwentyScreen( Tandem.rootTandem.createTandem( 'twentyScreen' ) )
    ], simOptions );
    sim.start();
  } );
} );