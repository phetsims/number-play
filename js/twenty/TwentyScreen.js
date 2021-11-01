// Copyright 2019-2021, University of Colorado Boulder

/**
 * The 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import PhetFont from '../../../scenery-phet/js/PhetFont.js';
import Image from '../../../scenery/js/nodes/Image.js';
import twentyScreenIconImage from '../../images/twenty_screen_icon_png.js';
import NumberPlayModel from '../common/model/NumberPlayModel.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import NumberPlayScreenView from '../common/view/NumberPlayScreenView.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';

const screenTwentyString = numberPlayStrings.screen.twenty;


class TwentyScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const screenOptions = {
      name: screenTwentyString,
      backgroundColorProperty: new Property( NumberPlayConstants.TWENTY_SCREEN_BACKGROUND ),
      homeScreenIcon: new ScreenIcon( new Image( twentyScreenIconImage ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    const screenViewConfig = {
      wordAccordionBoxConfig: {
        fill: NumberPlayConstants.ORANGE_BACKGROUND,
        font: new PhetFont( 54 ),
        contentXMargin: 10, // zero out to manage x margins in subclass TODO: unsure why 10 is needed to act like 0
        textOffset: new Vector2( 10, -10 ),
        localeSwitchOffset: new Vector2( -10, -7 ),
        speakerButtonOffset: new Vector2( 0, 38 ),
        speakerButtonScale: 0.8
      },
      totalAccordionBoxConfig: {
        fill: NumberPlayConstants.LIGHT_GREEN_BACKGROUND,
        font: new PhetFont( 76 ),
        arrowButtonConfig: {
          arrowWidth: 15,  // empirically determined
          arrowHeight: 15, // empirically determined
          spacing: 5       // empirically determined
        }
      },
      tenFrameAccordionBoxOptions: {
        fill: NumberPlayConstants.ORANGE_BACKGROUND,
        contentAlign: 'right'
      },
      upperAccordionBoxHeight: NumberPlayConstants.TWENTY_UPPER_ACCORDION_BOX_HEIGHT,
      lowerAccordionBoxHeight: NumberPlayConstants.TWENTY_LOWER_ACCORDION_BOX_HEIGHT,
      tandem: tandem.createTandem( 'view' )
    };

    super(
      () => new NumberPlayModel(
        NumberPlayConstants.TWENTY,
        new Vector2( 58, 349 ), // empirically determined
        tandem.createTandem( 'model' )
      ),
      model => new NumberPlayScreenView( model, screenViewConfig ),
      screenOptions
    );
  }
}

numberPlay.register( 'TwentyScreen', TwentyScreen );
export default TwentyScreen;