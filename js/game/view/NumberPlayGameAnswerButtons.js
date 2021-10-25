// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayGameAnswerButtons are buttons that can be selected to input an answer to a game.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import numberPlay from '../../numberPlay.js';

// constants
const ANSWER_BUTTON_TEXT_OPTIONS = { font: new PhetFont( 45 ) };
const BUTTON_DIMENSION = new Dimension2( 80, 100 );

class NumberPlayGameAnswerButtons extends Node {

  /**
   * @param {SubitizeGameLevel} level
   * @param {BooleanProperty} pointsAwardedNodeVisibleProperty
   * @param {function(boolean)} setFrownyFaceVisibilityCallback
   */
  constructor( level, pointsAwardedNodeVisibleProperty, setFrownyFaceVisibilityCallback ) {

    super();

    // @private {NumberProperty} number of times any button in answerButtons was pressed
    this.numberOfAnswerButtonPressesProperty = new NumberProperty( 0, { numberType: 'Integer' } );

    // @private {Object[]}
    this.buttonObjects = [];

    // @private {number}
    this.level = level;

    /**
     * Listener that is added to every answer button. It disabled selected buttons that are wrong, and turns correct
     * answer buttons green.
     *
     * @param {number} index - the index of the button in the group
     */
    const buttonListener = index => {
      this.numberOfAnswerButtonPressesProperty.value++;
      const buttonObject = this.buttonObjects[ index ];

      // this button is the correct answer button
      if ( level.subitizeNumberProperty.value === buttonObject.value ) {
        level.isSolvedProperty.value = true;
        setFrownyFaceVisibilityCallback( false );

        this.hbox.replaceChild( buttonObject.button, buttonObject.rectangle );

        this.buttonObjects.forEach( object => {
          level.subitizeNumberProperty.value !== object.value && object.button.setEnabled( false );
        } );

        // if this is the first guess, increase the score
        if ( this.numberOfAnswerButtonPressesProperty.value === 1 ) {
          level.scoreProperty.value++;
          pointsAwardedNodeVisibleProperty.value = true;
        }
      }
      else {
        pointsAwardedNodeVisibleProperty.value = false;
        setFrownyFaceVisibilityCallback( true );

        // disable incorrect answer button
        buttonObject.button.setEnabled( false );
      }
    };

    // create the buttons and green rectangles together
    for ( let i = 0; i < level.subitizeRange.getLength() + 1; i++ ) {
      const value = i + level.subitizeRange.min;
      const button = new RectangularPushButton( {
        content: new Text( value, ANSWER_BUTTON_TEXT_OPTIONS ),
        baseColor: Color.YELLOW,
        size: BUTTON_DIMENSION,
        cornerRadius: 10,
        yMargin: 24,
        listener: () => buttonListener( i )
      } );

      // create and replace the correct answer button with a rectangle and the correct number on top
      const rectangle = new Rectangle( 0, 0, BUTTON_DIMENSION.width, BUTTON_DIMENSION.height, {
          fill: Color.GREEN,
          cornerRadius: 10
        } );
      const correctAnswerText = new Text( value, ANSWER_BUTTON_TEXT_OPTIONS );
      correctAnswerText.center = rectangle.center;
      rectangle.addChild( correctAnswerText );

      this.buttonObjects.push( {
        value: value,
        button: button,
        rectangle: rectangle
      } );
    }

    // @private {HBox}
    this.hbox = new HBox( {
      children: this.buttonObjects.map( buttonRectangle => buttonRectangle.button ),
      spacing: 40
    } );
    this.addChild( this.hbox );
  }

  /**
   * Returns everything in the HBox to its original button state.
   *
   * @public
   */
  reset() {
    this.numberOfAnswerButtonPressesProperty.reset();
    this.buttonObjects.forEach( object => object.button.setEnabled( true ) );
    this.hbox.children = this.buttonObjects.map( object => object.button );
  }
}

numberPlay.register( 'NumberPlayGameAnswerButtons', NumberPlayGameAnswerButtons );
export default NumberPlayGameAnswerButtons;