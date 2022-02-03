// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Image } from '../../../scenery/js/imports.js';
import tenScreenIcon_png from '../../images/tenScreenIcon_png.js';
import NumberPlayModel from '../common/model/NumberPlayModel.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../common/NumberPlayConstants.js';
import NumberPlayScreenView from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import Tandem from '../../../tandem/js/Tandem.js';

const screenTenString = numberPlayStrings.screen.ten;

class TenScreen extends Screen {

  constructor( tandem: Tandem ) {

    const screenOptions = {
      name: screenTenString,
      backgroundColorProperty: NumberPlayColors.lightPurpleBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( tenScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    const screenViewOptions = {
      wordAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        font: new PhetFont( 62 ),
        textOffset: new Vector2( 0, -1 ),
        localeSwitchOffset: new Vector2( 0, -12 )
      },
      totalAccordionBoxOptions: {
        fill: NumberPlayColors.lightOrangeBackgroundColorProperty,
        font: new PhetFont( 98 ),
        contentXMargin: 0, // zero out to manage x margins in subclass
        arrowButtonOptions: {
          arrowWidth: 20, // empirically determined
          arrowHeight: 20 // empirically determined
        },
        arrowButtonSpacing: 10 // empirically determined
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayColors.purpleBackgroundColorProperty,
        contentAlign: 'center'
      } as AccordionBoxOptions,
      upperAccordionBoxHeight: NumberPlayConstants.TEN_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberPlayConstants.TEN_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem.createTandem( 'view' )
    };

    super(
      () => new NumberPlayModel(
        NumberPlayConstants.TEN,
        tandem.createTandem( 'model' )
      ),
      ( model: NumberPlayModel ) => new NumberPlayScreenView( model, screenViewOptions ),
      screenOptions
    );
  }
}

numberPlay.register( 'TenScreen', TenScreen );
export default TenScreen;