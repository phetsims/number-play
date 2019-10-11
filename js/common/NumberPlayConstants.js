// Copyright 2019, University of Colorado Boulder

/**
 * Constants used in multiple locations within this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );

  const NumberPlayConstants = {

    // the two defining numbers of this sim
    TEN: 10,
    TWENTY: 20,

    // layout
    SCREEN_VIEW_X_MARGIN: 15,
    SCREEN_VIEW_Y_MARGIN: 15,

    // colors
    TEN_SCREEN_BACKGROUND: 'rgb( 171, 255, 195 )',
    TWENTY_SCREEN_BACKGROUND: 'rgb( 255, 250, 210 )'

  };

  return numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
} );