// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import NumberSuiteCommonColors from '../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import twentyScreenIcon_png from '../../images/twentyScreenIcon_png.js';
import NumberPlayScreenView from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';
import TwentyModel from './model/TwentyModel.js';
import TwentyScreenView from './view/TwentyScreenView.js';

class TwentyScreen extends Screen<TwentyModel, NumberPlayScreenView> {

  public constructor( tandem: Tandem ) {

    const screenOptions = {
      name: NumberPlayStrings.screen.twentyStringProperty,
      backgroundColorProperty: NumberSuiteCommonColors.lightOrangeBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( twentyScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new TwentyModel( tandem.createTandem( 'model' ) ),
      model => new TwentyScreenView( model, tandem.createTandem( 'view' ) ),
      screenOptions
    );
  }
}

numberPlay.register( 'TwentyScreen', TwentyScreen );
export default TwentyScreen;