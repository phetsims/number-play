// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Compare' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import compareScreenIcon_png from '../../images/compareScreenIcon_png.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import numberPlay from '../numberPlay.js';
import numberPlayStrings from '../numberPlayStrings.js';
import CompareModel from './model/CompareModel.js';
import CompareScreenView from './view/CompareScreenView.js';
import NumberPlayQueryParameters from '../common/NumberPlayQueryParameters.js';

const screenCompareString = numberPlayStrings.screen.compare;


class CompareScreen extends Screen<CompareModel, CompareScreenView> {

  constructor( tandem: Tandem ) {

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
        NumberPlayQueryParameters.compareMax,
        tandem.createTandem( 'model' ) ),
      model => new CompareScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'CompareScreen', CompareScreen );
export default CompareScreen;