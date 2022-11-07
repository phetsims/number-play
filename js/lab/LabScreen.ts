// Copyright 2019-2022, University of Colorado Boulder

/**
 * The 'Lab' screen. Used in both 'Number Compare' and 'Number Play' simulations.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Screen from '../../../joist/js/Screen.js';
import ScreenIcon from '../../../joist/js/ScreenIcon.js';
import { Image } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';
import labScreenIcon_png from '../../images/labScreenIcon_png.js';
import NumberPlayColors from '../common/NumberPlayColors.js';
import numberPlay from '../numberPlay.js';
import NumberPlayStrings from '../NumberPlayStrings.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';
import NumberSuiteCommonPreferences from '../common/model/NumberSuiteCommonPreferences.js';
import { SymbolType } from './view/SymbolCardNode.js';

class LabScreen<T extends NumberSuiteCommonPreferences> extends Screen<LabModel, LabScreenView<NumberSuiteCommonPreferences>> {

  public constructor( symbolTypes: SymbolType[], preferences: T, tandem: Tandem ) {

    const options = {
      name: NumberPlayStrings.screen.labStringProperty,
      backgroundColorProperty: NumberPlayColors.lightPurpleBackgroundColorProperty,
      homeScreenIcon: new ScreenIcon( new Image( labScreenIcon_png ), {
        maxIconWidthProportion: 1,
        maxIconHeightProportion: 1
      } ),
      tandem: tandem
    };

    super(
      () => new LabModel( tandem.createTandem( 'model' ) ),
      ( model: LabModel ) => new LabScreenView( model, symbolTypes, preferences, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'LabScreen', LabScreen );
export default LabScreen;