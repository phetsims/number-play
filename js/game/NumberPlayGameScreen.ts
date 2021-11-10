// Copyright 2019-2021, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import Image from '../../../scenery/js/nodes/Image.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gameScreenIconImage from '../../images/game_screen_icon_png.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import NumberPlayGameModel from './model/NumberPlayGameModel.js';
import NumberPlayGameScreenView from './view/NumberPlayGameScreenView.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import ColorProperty from '../../../scenery/js/util/ColorProperty.js';
import Color from '../../../scenery/js/util/Color.js';

const screenGameString = numberPlayStrings.screen.game;

class NumberPlayGameScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem: Tandem ) {

    const options = {
      name: screenGameString,
      backgroundColorProperty: new ColorProperty( new Color( NumberPlayConstants.GAME_SCREEN_BACKGROUND ) ),
      // @ts-ignore, see https://github.com/phetsims/number-play/issues/71
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