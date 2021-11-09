// Copyright 2021, University of Colorado Boulder

import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CardinalityCountGameLevel from '../model/CardinalityCountGameLevel.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';

class CardinalityCountGameLevelNode extends NumberPlayGameLevelNode {

  constructor( level: CardinalityCountGameLevel,
               levelProperty: Property<SubitizeGameLevel | CardinalityCountGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2>
  ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

  }

}

numberPlay.register( 'CardinalityCountGameLevelNode', CardinalityCountGameLevelNode );
export default CardinalityCountGameLevelNode;