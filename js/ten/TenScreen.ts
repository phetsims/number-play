// Copyright 2019-2023, University of Colorado Boulder

/**
 * The 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import tenScreenIcon_png from '../../images/tenScreenIcon_png.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NumberSuiteCommonColors from '../../../number-suite-common/js/common/NumberSuiteCommonColors.js';
import TenModel from './model/TenModel.js';
import TenScreenView from './view/TenScreenView.js';

class TenScreen extends Screen<TenModel, TenScreenView> {

  public constructor( tandem: Tandem ) {

    const screenOptions = {
      name: NumberPlayStrings.screen.tenStringProperty,
      backgroundColorProperty: NumberSuiteCommonColors.lightPurpleBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( tenScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new TenModel( tandem.createTandem( 'model' ) ),
      model => new TenScreenView( model, tandem.createTandem( 'view' ) ),
      screenOptions
    );
  }
}

numberPlay.register( 'TenScreen', TenScreen );
export default TenScreen;