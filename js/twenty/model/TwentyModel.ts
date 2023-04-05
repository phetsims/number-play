// Copyright 2023, University of Colorado Boulder

/**
 * TwentyModel is the model for the 'Twenty' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayModel from '../../common/model/NumberPlayModel.js';
import numberPlay from '../../numberPlay.js';
import numberPlayUtteranceQueue from '../../common/view/numberPlayUtteranceQueue.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';

export default class TwentyModel extends NumberPlayModel {

  public constructor( tandem: Tandem ) {
    super( NumberPlayConstants.MAX_SUM, numberPlayUtteranceQueue.twentyScreenSpeechDataProperty, tandem );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'TwentyModel', TwentyModel );