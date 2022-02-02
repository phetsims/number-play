// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import twentyScreenIcon_png from '../../images/twentyScreenIcon_png.js';
import NumberPlayModel from '../common/model/NumberPlayModel.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../common/NumberPlayConstants.js';
import NumberPlayScreenView from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';

const screenTwentyString = numberPlayStrings.screen.twenty;


class TwentyScreen extends Screen {

  constructor( tandem: Tandem ) {

    const screenOptions = {
      name: screenTwentyString,
      backgroundColorProperty: NumberPlayColors.lightOrangeBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( twentyScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    const screenViewConfig = {
      wordAccordionBoxOptions: {
        fill: NumberPlayColors.orangeBackgroundColorProperty,
        font: new PhetFont( 54 ),
        contentXMargin: 10, // zero out to manage x margins in subclass TODO: unsure why 10 is needed to act like 0
        textOffset: new Vector2( 10, -10 ),
        localeSwitchOffset: new Vector2( -10, -7 )
      },
      totalAccordionBoxOptions: {
        fill: NumberPlayColors.lightPurpleBackgroundColorProperty,
        font: new PhetFont( 76 ),
        arrowButtonOptions: {
          arrowWidth: 15, // empirically determined
          arrowHeight: 15 // empirically determined
        },
        arrowButtonSpacing: 5 // empirically determined
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayColors.orangeBackgroundColorProperty,
        contentAlign: 'right'
      } as AccordionBoxOptions,
      upperAccordionBoxHeight: NumberPlayConstants.TWENTY_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberPlayConstants.TWENTY_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem.createTandem( 'view' )
    };

    super(
      () => new NumberPlayModel(
        NumberPlayConstants.TWENTY,
        tandem.createTandem( 'model' )
      ),
      ( model: NumberPlayModel ) => new NumberPlayScreenView( model, screenViewConfig ),
      screenOptions
    );
  }
}

numberPlay.register( 'TwentyScreen', TwentyScreen );
export default TwentyScreen;