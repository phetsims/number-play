// Copyright 2019, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GameModel = require( 'NUMBER_PLAY/game/model/GameModel' );
  const GameScreenView = require( 'NUMBER_PLAY/game/view/GameScreenView' );
  const Image = require( 'SCENERY/nodes/Image' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const Property = require( 'AXON/Property' );
  const Screen = require( 'JOIST/Screen' );

  // strings
  const screenGameString = require( 'string!NUMBER_PLAY/screen.game' );

  // images
  const gameScreenIconImage = require( 'image!NUMBER_PLAY/game_screen_icon.png' );

  class GameScreen extends Screen {

    /**
     * @param {Tandem} tandem
     */
    constructor( tandem ) {

      const options = {
        name: screenGameString,
        backgroundColorProperty: new Property( 'white' ),
        homeScreenIcon: new Image( gameScreenIconImage ),
        tandem: tandem
      };

      super(
        () => new GameModel( tandem.createTandem( 'model' ) ),
        model => new GameScreenView( model, tandem.createTandem( 'view' ) ),
        options
      );
    }
  }

  return numberPlay.register( 'GameScreen', GameScreen );
} );