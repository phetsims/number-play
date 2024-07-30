// Copyright 2023, University of Colorado Boulder

/**
 * TenModel is the model for the 'Ten' screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import NumberPlayModel from '../../common/model/NumberPlayModel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import numberPlay from '../../numberPlay.js';

// eslint-disable-next-line no-view-imported-from-model
import numberPlayUtteranceQueue from '../../common/view/numberPlayUtteranceQueue.js';

export default class TenModel extends NumberPlayModel {

  public constructor( tandem: Tandem ) {
    super( NumberPlayConstants.TEN, numberPlayUtteranceQueue.tenScreenSpeechDataProperty, tandem );
  }

  public override dispose(): void {
    Disposable.assertNotDisposable();
    super.dispose();
  }
}

numberPlay.register( 'TenModel', TenModel );