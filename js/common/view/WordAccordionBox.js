// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Word' accordion box, which is the panel in the upper left corner of the sim that displays a written
 * representation of the current number.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const merge = require( 'PHET_CORE/merge' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );

  // strings
  const wordString = require( 'string!NUMBER_PLAY/word' );
  const zeroString = require( 'string!NUMBER_PLAY/zero' );
  const oneString = require( 'string!NUMBER_PLAY/one' );
  const twoString = require( 'string!NUMBER_PLAY/two' );
  const threeString = require( 'string!NUMBER_PLAY/three' );
  const fourString = require( 'string!NUMBER_PLAY/four' );
  const fiveString = require( 'string!NUMBER_PLAY/five' );
  const sixString = require( 'string!NUMBER_PLAY/six' );
  const sevenString = require( 'string!NUMBER_PLAY/seven' );
  const eightString = require( 'string!NUMBER_PLAY/eight' );
  const nineString = require( 'string!NUMBER_PLAY/nine' );
  const tenString = require( 'string!NUMBER_PLAY/ten' );
  const elevenString = require( 'string!NUMBER_PLAY/eleven' );
  const twelveString = require( 'string!NUMBER_PLAY/twelve' );
  const thirteenString = require( 'string!NUMBER_PLAY/thirteen' );
  const fourteenString = require( 'string!NUMBER_PLAY/fourteen' );
  const fifteenString = require( 'string!NUMBER_PLAY/fifteen' );
  const sixteenString = require( 'string!NUMBER_PLAY/sixteen' );
  const seventeenString = require( 'string!NUMBER_PLAY/seventeen' );
  const eighteenString = require( 'string!NUMBER_PLAY/eighteen' );
  const nineteenString = require( 'string!NUMBER_PLAY/nineteen' );
  const twentyString = require( 'string!NUMBER_PLAY/twenty' );

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

        font: null // {Font} @required - font of the displayed string value
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

      assert && assert( config.font, 'font is required' );

      const contentNode = new Rectangle( {
        rectHeight: height
      } );

      const wordText = new Text( MAP_NUMBER_TO_STRING[ currentNumberProperty.value ], {
        font: config.font
      } );
      wordText.centerY = contentNode.centerY;
      wordText.left = contentNode.left;
      contentNode.addChild( wordText );

      super( contentNode, config );

      currentNumberProperty.lazyLink( currentNumber => {
        wordText.text = MAP_NUMBER_TO_STRING[ currentNumber ];
      } );
    }
  }

  return numberPlay.register( 'WordAccordionBox', WordAccordionBox );
} );