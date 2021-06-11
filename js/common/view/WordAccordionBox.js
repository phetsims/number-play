// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import OnOffSwitch from '../../../../sun/js/OnOffSwitch.js';
import speakerImage from '../../../images/speaker_png.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayConstants from '../NumberPlayConstants.js';

const wordString = numberPlayStrings.word;
const zeroString = numberPlayStrings.zero;
const oneString = numberPlayStrings.one;
const twoString = numberPlayStrings.two;
const threeString = numberPlayStrings.three;
const fourString = numberPlayStrings.four;
const fiveString = numberPlayStrings.five;
const sixString = numberPlayStrings.six;
const sevenString = numberPlayStrings.seven;
const eightString = numberPlayStrings.eight;
const nineString = numberPlayStrings.nine;
const tenString = numberPlayStrings.ten;
const elevenString = numberPlayStrings.eleven;
const twelveString = numberPlayStrings.twelve;
const thirteenString = numberPlayStrings.thirteen;
const fourteenString = numberPlayStrings.fourteen;
const fifteenString = numberPlayStrings.fifteen;
const sixteenString = numberPlayStrings.sixteen;
const seventeenString = numberPlayStrings.seventeen;
const eighteenString = numberPlayStrings.eighteen;
const nineteenString = numberPlayStrings.nineteen;
const twentyString = numberPlayStrings.twenty;
const englishString = numberPlayStrings.english;
const spanishString = numberPlayStrings.spanish;

// constants
const MAP_NUMBER_TO_STRING = {
  0: zeroString,
  1: oneString,
  2: twoString,
  3: threeString,
  4: fourString,
  5: fiveString,
  6: sixString,
  7: sevenString,
  8: eightString,
  9: nineString,
  10: tenString,
  11: elevenString,
  12: twelveString,
  13: thirteenString,
  14: fourteenString,
  15: fifteenString,
  16: sixteenString,
  17: seventeenString,
  18: eighteenString,
  19: nineteenString,
  20: twentyString
};

class WordAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {number} height - the height of this accordion box
   * @param {Object} config
   */
  constructor( currentNumberProperty, height, config ) {

    config = merge( {
      titleNode: new Text( wordString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
      minWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,

      font: required( config.font ),                               // {Font} - font of the displayed string value
      textOffsetY: required( config.textOffsetY ),                 // {number}
      toggleControlOffset: required( config.toggleControlOffset ), // {number}
      speakerButtonOffset: required( config.speakerButtonOffset ), // {Vector2}
      speakerButtonScale: required( config.speakerButtonScale )    // {number}
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH - 55
    } );

    const wordText = new Text( MAP_NUMBER_TO_STRING[ currentNumberProperty.value ], {
      font: config.font
    } );
    wordText.left = contentNode.left;
    wordText.centerY = contentNode.centerY + config.textOffsetY;
    contentNode.addChild( wordText );

    // create toggle switch and labels
    const languageControl = new Node();
    const onOffSwitch = new OnOffSwitch( new BooleanProperty( false ), {
      size: new Dimension2( 40, 20 ),
      trackFillLeft: 'lightgray',
      trackFillRight: 'lightgray'
    } );
    const labelOptions = { font: new PhetFont( 14 ) };
    const englishText = new Text( englishString, labelOptions );
    const spanishText = new Text( spanishString, labelOptions );

    // position and add toggle switch and labels (disabled until further design is complete)
    const labelXMargin = 8;
    const disabledOpacity = 0.5;
    onOffSwitch.centerX = contentNode.centerX + config.toggleControlOffset.x;
    onOffSwitch.bottom = contentNode.bottom + config.toggleControlOffset.y;
    englishText.right = onOffSwitch.left - labelXMargin;
    englishText.centerY = onOffSwitch.centerY;
    spanishText.left = onOffSwitch.right + labelXMargin;
    spanishText.centerY = englishText.centerY;
    languageControl.addChild( onOffSwitch );
    languageControl.addChild( englishText );
    languageControl.addChild( spanishText );
    languageControl.pickable = false;
    languageControl.opacity = disabledOpacity;
    // contentNode.addChild( languageControl );

    // create and add speaker button
    const speakerButton = new RectangularPushButton( {
      content: new Image( speakerImage, {
        maxWidth: 26,
        maxHeight: 26
      } ),
      listener: () => {},
      baseColor: 'yellow',
      xMargin: 5,
      yMargin: 6,
      pickable: false,
      opacity: disabledOpacity
    } );
    speakerButton.setScaleMagnitude( config.speakerButtonScale );
    speakerButton.right = contentNode.right + config.speakerButtonOffset.x;
    speakerButton.centerY = wordText.centerY + config.speakerButtonOffset.y;
    // contentNode.addChild( speakerButton );

    super( contentNode, config );

    currentNumberProperty.lazyLink( currentNumber => {
      wordText.text = MAP_NUMBER_TO_STRING[ currentNumber ];
    } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;