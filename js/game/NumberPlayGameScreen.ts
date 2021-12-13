// Copyright 2019-2021, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gameScreenIconImage from '../../images/game_screen_icon_png.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import NumberPlayGameModel from './model/NumberPlayGameModel.js';
import NumberPlayGameScreenView from './view/NumberPlayGameScreenView.js';

class NumberPlayGameScreen extends Screen {

  constructor( tandem: Tandem ) {

    const options = {
      name: numberPlayStrings.screen.game,
      backgroundColorProperty: NumberPlayColors.gameScreenBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( gameScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new NumberPlayGameModel( tandem.createTandem( 'model' ) ),
      ( model: NumberPlayGameModel ) => new NumberPlayGameScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'NumberPlayGameScreen', NumberPlayGameScreen );
export default NumberPlayGameScreen;