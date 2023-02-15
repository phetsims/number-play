// Copyright 2023, University of Colorado Boulder

/**
 * TenModel is the model for the 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayModel from '../../common/model/NumberPlayModel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';
import numberPlayUtteranceQueue from '../../common/view/numberPlayUtteranceQueue.js';

export default class TenModel extends NumberPlayModel {

  public constructor( tandem: Tandem ) {
    super( NumberPlayConstants.TEN, numberPlayUtteranceQueue.tenScreenSpeechDataProperty, tandem );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'TenModel', TenModel );