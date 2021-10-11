// Copyright 2021, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Property from '../../../axon/js/Property.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import gameScreenIconImage from '../../images/game_screen_icon_png.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import NumberPlayGameModel from './model/NumberPlayGameModel.js';
import NumberPlayGameScreenView from './view/NumberPlayGameScreenView.js';

const screenGameString = numberPlayStrings.screen.game;

class NumberPlayGameScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: screenGameString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new ScreenIcon( new Image( gameScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new NumberPlayGameModel( tandem.createTandem( 'model' ) ),
      model => new NumberPlayGameScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'NumberPlayGameScreen', NumberPlayGameScreen );
export default NumberPlayGameScreen;