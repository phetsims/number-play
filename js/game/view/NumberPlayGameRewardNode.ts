// Copyright 2023, University of Colorado Boulder

/**
 * NumberPlayGameRewardNode is the various objects that are falling behind the RewardDialog when the user reaches the
 * score that results in a reward.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import StarNode from '../../../../scenery-phet/js/StarNode.js';
import RewardNode from '../../../../vegas/js/RewardNode.js';
import numberPlay from '../../numberPlay.js';
import { Image, ImageOptions } from '../../../../scenery/js/imports.js';

// constants
const NUMBER_OF_NODES = 100;
const IMAGE_OPTIONS: ImageOptions = {
  maxHeight: 40
};
const NODES = [
  new StarNode(),
  new Image( CountingCommonConstants.COUNTING_OBJECT_TYPE_TO_IMAGE.get( CountingObjectType.DOG ), IMAGE_OPTIONS ),
  new Image( CountingCommonConstants.COUNTING_OBJECT_TYPE_TO_IMAGE.get( CountingObjectType.BALL ), IMAGE_OPTIONS ),
  new Image( CountingCommonConstants.COUNTING_OBJECT_TYPE_TO_IMAGE.get( CountingObjectType.APPLE ), IMAGE_OPTIONS ),
  new Image( CountingCommonConstants.COUNTING_OBJECT_TYPE_TO_IMAGE.get( CountingObjectType.BUTTERFLY ), IMAGE_OPTIONS )
];

export default class NumberPlayGameRewardNode extends RewardNode {

  public constructor() {

    super( {
      visible: false,
      nodes: RewardNode.createRandomNodes( NODES, NUMBER_OF_NODES )
    } );
  }
}

numberPlay.register( 'NumberPlayGameRewardNode', NumberPlayGameRewardNode );