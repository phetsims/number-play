// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Game' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import NumberSuiteCommonColors from '../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import gameScreenIcon_png from '../../images/gameScreenIcon_png.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';
import NumberPlayGameModel from './model/NumberPlayGameModel.js';
import NumberPlayGameScreenView from './view/NumberPlayGameScreenView.js';

class NumberPlayGameScreen extends Screen<NumberPlayGameModel, NumberPlayGameScreenView> {

  public constructor( tandem: Tandem ) {

    const options = {
      name: NumberPlayStrings.screen.gameStringProperty,
      backgroundColorProperty: NumberSuiteCommonColors.lightOrangeBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( gameScreenIcon_png ), {
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