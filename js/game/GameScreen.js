// Copyright 2019-2020, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import gameScreenIconImage from '../../images/game_screen_icon_png.js';
import numberPlayStrings from '../number-play-strings.js';
import numberPlay from '../numberPlay.js';
import GameModel from './model/GameModel.js';
import GameScreenView from './view/GameScreenView.js';

const screenGameString = numberPlayStrings.screen.game;


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

numberPlay.register( 'GameScreen', GameScreen );
export default GameScreen;