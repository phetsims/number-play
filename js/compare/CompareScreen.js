// Copyright 2019, University of Colorado Boulder

/**
 * The 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import compareScreenIconImage from '../../images/compare_screen_icon_png.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import numberPlayStrings from '../number-play-strings.js';
import numberPlay from '../numberPlay.js';
import CompareModel from './model/CompareModel.js';
import CompareScreenView from './view/CompareScreenView.js';

const screenCompareString = numberPlayStrings.screen.compare;


class CompareScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: screenCompareString,
      backgroundColorProperty: new Property( NumberPlayConstants.WHITE_BACKGROUND ),
      homeScreenIcon: new Image( compareScreenIconImage ),
      tandem: tandem
    };

    super(
      () => new CompareModel(
        NumberPlayConstants.TWENTY,
        new Vector2( 16, 262 ), // empirically determined
        1.3,                    // empirically determined
        tandem.createTandem( 'model' ) ),
      model => new CompareScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'CompareScreen', CompareScreen );
export default CompareScreen;