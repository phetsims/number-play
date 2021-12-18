// Copyright 2019-2021, University of Colorado Boulder

/**
 * The 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import compareScreenIcon_png from '../../images/compareScreenIcon_png.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import NumberPlayConstants from '../common/NumberPlayConstants.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
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
      backgroundColorProperty: NumberPlayColors.whiteBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( compareScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
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