// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeGameLevelNode is the class for a 'Subitize' game level view.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SpeechSynthesisButton from '../../common/view/SpeechSynthesisButton.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayGameLevelNode from './NumberPlayGameLevelNode.js';
import Text from '../../../../scenery/js/nodes/Text.js';

// constants
const SUBITIZE_NODE_WIDTH = 425;
const SUBITIZE_NODE_HEIGHT = 275;

class SubitizeGameLevelNode extends NumberPlayGameLevelNode {

  /**
   * @param {SubitizeGameLevel} level
   * @param {Property.<SubitizeGameLevel>} levelProperty
   * @param {Bounds2} layoutBounds
   * @param {Property.<Bounds2>} visibleBoundsProperty
   */
  constructor( level, levelProperty, layoutBounds, visibleBoundsProperty ) {

    super( level, levelProperty, layoutBounds, visibleBoundsProperty );

    // create and add the questionText which is the prompt above the subitizerNode box
    const questionText = new Text( level.questionStringProperty.value, {
      font: new PhetFont( 45 )
    } );
    questionText.centerX = layoutBounds.centerX;
    questionText.top = this.statusBar.bottom + 20; // empirically determined
    this.addChild( questionText );

    // create and add the subitizerNode
    //TODO: this is a placeholder, see https://github.com/phetsims/number-play/issues/62
    const subitizerNode = new Rectangle( layoutBounds.centerX - SUBITIZE_NODE_WIDTH / 2, layoutBounds.centerY - SUBITIZE_NODE_HEIGHT / 2, SUBITIZE_NODE_WIDTH, SUBITIZE_NODE_HEIGHT, 10, 10, {
      fill: 'white'
    } );
    subitizerNode.top = questionText.bottom + 15; // empirically determined
    this.addChild( subitizerNode );

    // create and add the speechSynthesisButton
    const speechSynthesisButton = new SpeechSynthesisButton( level.questionStringProperty );
    speechSynthesisButton.setLeftCenter( questionText.getRightCenter() );
    speechSynthesisButton.left = subitizerNode.right + 10; // empirically determined
    this.addChild( speechSynthesisButton );

    // create and add the showAgainButton which flashes the content in the subitizerNode again
    const resetIcon = new Path( new ResetShape( 16 ), { fill: Color.BLACK } );
    const showAgainButton = new RectangularPushButton( {
      content: resetIcon,
      xMargin: 6,
      yMargin: 6,
      baseColor: new Color( 0x8DB3FF )
    } );
    showAgainButton.left = speechSynthesisButton.left;
    showAgainButton.setBottom( subitizerNode.getBottom() );
    this.addChild( showAgainButton );

    // create and add answerButtons which give the options to select between 1 - 5
    const answerButtons = new HBox( { spacing: 40 } );
    for ( let i = 1; i < 6; i++ ) {
      answerButtons.addChild( new RectangularPushButton( {
        content: new Text( i, { font: new PhetFont( 10 ) } ),
        baseColor: Color.YELLOW,
        size: new Dimension2( 80, 100 ),
        cornerRadius: 10,
        xMargin: 25,
        yMargin: 22
      } ) );
    }
    answerButtons.centerX = subitizerNode.centerX;
    answerButtons.top = subitizerNode.bottom + 40; // empirically determined
    this.addChild( answerButtons );
  }
}

numberPlay.register( 'SubitizeGameLevelNode', SubitizeGameLevelNode );
export default SubitizeGameLevelNode;