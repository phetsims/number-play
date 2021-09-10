// Copyright 2019-2021, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import LanguageControlNode from './LanguageControlNode.js';

// constants
const CONTENT_MAX_WIDTH = 260; // empirically determined to not shrink the accordion box content

// strings
const wordString = numberPlayStrings.word;

class WordAccordionBox extends AccordionBox {

  /**
   * @param {NumberProperty} currentNumberProperty
   * @param {number} height - the height of this accordion box
   * @param {Object} config
   */
  constructor( currentNumberProperty, height, config ) {

    config = merge( {
      titleNode: new Text( wordString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.UPPER_OUTER_AB_TITLE_MAX_WIDTH
      } ),
      minWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,
      maxWidth: NumberPlayConstants.UPPER_OUTER_ACCORDION_BOX_WIDTH,

      font: required( config.font ), // {Font} - font of the displayed string value
      textOffsetY: required( config.textOffsetY ), // {number}
      languageControlOffset: required( config.languageControlOffset ), // {Vector2}
      speakerButtonOffset: required( config.speakerButtonOffset ), // {Vector2}
      speakerButtonScale: required( config.speakerButtonScale ) // {number}
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: CONTENT_MAX_WIDTH
    } );

    const wordText = new Text( NumberPlayConstants.NUMBER_TO_STRING[ currentNumberProperty.value ], {
      font: config.font,
      maxWidth: CONTENT_MAX_WIDTH
    } );
    wordText.left = contentNode.left;
    wordText.centerY = contentNode.centerY + config.textOffsetY;
    contentNode.addChild( wordText );

    // create and add the LanguageControlNode (disabled until further design is complete), see https://github.com/phetsims/number-play/issues/31
    const languageControlNode = new LanguageControlNode( {
      // make sure the offset doesn't cause it to poke out of either end of the content node when at its max width
      maxWidth: CONTENT_MAX_WIDTH + config.languageControlOffset.x * 2
    } );
    languageControlNode.centerX = contentNode.centerX + config.languageControlOffset.x;
    languageControlNode.bottom = contentNode.bottom + config.languageControlOffset.y;
    languageControlNode.pickable = false;
    languageControlNode.opacity = 0.5;
    contentNode.addChild( languageControlNode );

    super( contentNode, config );

    currentNumberProperty.lazyLink( currentNumber => {
      wordText.text = NumberPlayConstants.NUMBER_TO_STRING[ currentNumber ];
    } );
  }
}

numberPlay.register( 'WordAccordionBox', WordAccordionBox );
export default WordAccordionBox;