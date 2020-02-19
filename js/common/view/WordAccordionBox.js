// Copyright 2019-2020, University of Colorado Boulder

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
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const Image = require( 'SCENERY/nodes/Image' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const OnOffSwitch = require( 'SUN/OnOffSwitch' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  const required = require( 'PHET_CORE/required' );
  const Text = require( 'SCENERY/nodes/Text' );

  // images
  const speakerImage = require( 'image!NUMBER_PLAY/speaker.png' );

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
  const englishString = require( 'string!NUMBER_PLAY/english' );
  const spanishString = require( 'string!NUMBER_PLAY/spanish' );

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
      contentNode.addChild( languageControl );

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
      contentNode.addChild( speakerButton );

      super( contentNode, config );

      currentNumberProperty.lazyLink( currentNumber => {
        wordText.text = MAP_NUMBER_TO_STRING[ currentNumber ];
      } );
    }
  }

  return numberPlay.register( 'WordAccordionBox', WordAccordionBox );
} );