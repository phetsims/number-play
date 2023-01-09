// Copyright 2023, University of Colorado Boulder

/**
 * TwentyModel is the model for the 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayModel from '../../common/model/NumberPlayModel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';

export default class TwentyModel extends NumberPlayModel {

  public constructor( tandem: Tandem ) {
    super( NumberPlayConstants.TWENTY, tandem );
  }
}

numberPlay.register( 'TwentyModel', TwentyModel );