// Copyright 2019, University of Colorado Boulder

/**
 * The 'Lab' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Property from '../../../axon/js/Property.js';
import Vector2 from '../../../dot/js/Vector2.js';
import Screen from '../../../joist/js/Screen.js';
import Image from '../../../scenery/js/nodes/Image.js';
import labScreenIconImage from '../../images/lab_screen_icon_png.js';
import numberPlayStrings from '../number-play-strings.js';
import numberPlay from '../numberPlay.js';
import LabModel from './model/LabModel.js';
import LabScreenView from './view/LabScreenView.js';

const screenLabString = numberPlayStrings.screen.lab;


class LabScreen extends Screen {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    const options = {
      name: screenLabString,
      backgroundColorProperty: new Property( 'white' ),
      homeScreenIcon: new Image( labScreenIconImage ),
      tandem: tandem
    };

    super(
      () => new LabModel(
        100,
        new Vector2( 16, 262 ), // empirically determined
        1.6,                    // empirically determined
        tandem.createTandem( 'model' ) ),
      model => new LabScreenView( model, tandem.createTandem( 'view' ) ),
      options
    );
  }
}

numberPlay.register( 'LabScreen', LabScreen );
export default LabScreen;