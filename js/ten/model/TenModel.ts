// Copyright 2023-2024, University of Colorado Boulder

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

// eslint-disable-next-line phet/no-view-imported-from-model
import numberPlayUtteranceQueue from '../../common/view/numberPlayUtteranceQueue.js';
import numberPlay from '../../numberPlay.js';

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