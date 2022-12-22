// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Image } from '../../../scenery/js/imports.js';
import tenScreenIcon_png from '../../images/tenScreenIcon_png.js';
import NumberPlayModel from '../common/model/NumberPlayModel.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import NumberPlayScreenView, { NumberPlayScreenViewOptions } from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';
import NumberSuiteCommonColors from '../../../number-suite-common/js/common/NumberSuiteCommonColors.js';

class TenScreen extends Screen<NumberPlayModel, NumberPlayScreenView> {

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

    const screenViewOptions: NumberPlayScreenViewOptions = {
      wordAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        font: new PhetFont( 62 ),
        textOffsetX: 30
      },
      totalAccordionBoxOptions: {
        fill: NumberSuiteCommonColors.lightOrangeBackgroundColorProperty,
        font: new PhetFont( 98 ),
        arrowButtonOptions: {
          arrowWidth: 20, // empirically determined
          arrowHeight: 20 // empirically determined
        },
        arrowButtonSpacing: 10 // empirically determined
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        tenFrameOffsetX: 0
      },
      upperAccordionBoxHeight: NumberPlayConstants.TEN_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem.createTandem( 'view' )
    };

    super(
      () => new NumberPlayModel(
        NumberPlayConstants.TEN,
        tandem.createTandem( 'model' )
      ),
      model => new NumberPlayScreenView( model, screenViewOptions ),
      screenOptions
    );
  }
}

numberPlay.register( 'TenScreen', TenScreen );
export default TenScreen;