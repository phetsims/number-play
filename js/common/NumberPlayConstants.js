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
    SCREEN_VIEW_X_PADDING: 15,
    SCREEN_VIEW_Y_PADDING: 15,
    PANEL_X_MARGIN: 60,           // distance between the sides of the sim and all panels near the side
    PANEL_TOP_MARGIN: 30,         // distance between the top of the sim and all upper panels
    PANEL_BOTTOM_MARGIN: 15,      // distance between the bottom of the sim and all lower panels

    // sizing
    UPPER_OUTER_PANEL_WIDTH: 310, // width of the panels in the upper left and right of both screens

    // options for all AccordionBox instances
    ACCORDION_BOX_OPTIONS: {
      resize: false,
      cornerRadius: 8,
      titleYMargin: 10,
      buttonXMargin: 10,
      buttonYMargin: 10,
      contentXMargin: 20,
      contentYMargin: 15,
      expandCollapseButtonOptions: {
        sideLength: 20
      }
    },

    // colors
    TEN_SCREEN_BACKGROUND: 'rgb( 171, 255, 195 )',
    TWENTY_SCREEN_BACKGROUND: 'rgb( 255, 250, 210 )',
    GREEN_BACKGROUND: 'rgb( 217, 255, 223 )',
    ORANGE_BACKGROUND: 'rgb( 255, 218, 176 )'

  };

  return numberPlay.register( 'NumberPlayConstants', NumberPlayConstants );
} );