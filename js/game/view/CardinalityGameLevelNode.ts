// Copyright 2021, University of Colorado Boulder

import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import CardinalityGameLevel from '../model/CardinalityGameLevel.js';
import numberPlay from '../../numberPlay.js';
import SubitizeGameLevel from '../model/SubitizeGameLevel.js';
import NumberPlayGameAnswerButtons from './NumberPlayGameAnswerButtons.js';

class CardinalityGameLevelNode extends NumberPlayGameLevelNode<CardinalityGameLevel> {

  constructor( level: CardinalityGameLevel,
               levelProperty: Property<SubitizeGameLevel | CardinalityGameLevel | null>,
               layoutBounds: Bounds2,
               visibleBoundsProperty: Property<Bounds2> ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

    // create and add the answer buttons
    this.answerButtons = new NumberPlayGameAnswerButtons( level, this.pointsAwardedNodeVisibleProperty, () => {
      this.setFrownyFaceVisibility( false );
    }, () => {
      this.setFrownyFaceVisibility( true );
    } );
    this.answerButtons.centerX = layoutBounds.centerX;
    this.answerButtons.bottom = layoutBounds.maxY - 58; // TODO magic number
    this.addChild( this.answerButtons );
  }

  public reset() {
    super.reset();
  }

  protected answerButtons: NumberPlayGameAnswerButtons;

}

numberPlay.register( 'CardinalityGameLevelNode', CardinalityGameLevelNode );
export default CardinalityGameLevelNode;