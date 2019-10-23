// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const Color = require( 'SCENERY/util/Color' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObjectsPlayAreaNode = require( 'NUMBER_PLAY/common/view/ObjectsPlayAreaNode' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const PlayObjectNode = require( 'NUMBER_PLAY/common/view/PlayObjectNode' );
  const PlayObjectType = require( 'NUMBER_PLAY/common/model/PlayObjectType' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const objectsString = require( 'string!NUMBER_PLAY/objects' );

  class ObjectsAccordionBox extends AccordionBox {

    /**
     * @param {number} height - the height of this accordion box
     * @param {NumberPlayPlayArea} objectsPlayArea
     * @param {Object} [options]
     */
    constructor( height, objectsPlayArea, config ) {

      config = merge( {
        titleNode: new Text( objectsString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
        fill: NumberPlayConstants.BLUE_BACKGROUND,

        contentWidth: null,      // {number} @required
        radioButtonSize: null,   // {Dimension2} @required
        radioButtonSpacing: null // {number} @required
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

      assert && assert( config.contentWidth, `contentWidth is required: ${config.contentWidth}` );
      assert && assert( config.radioButtonSize, `radioButtonSize is required: ${config.radioButtonSize}` );
      assert && assert( config.radioButtonSpacing, `radioButtonSize is required: ${config.radioButtonSpacing}` );

      const contentNode = new Rectangle( {
        rectHeight: height,
        rectWidth: config.contentWidth
      } );

      const playAreaMarginY = 15;
      const playAreaViewBounds = new Bounds2(
        contentNode.left,
        contentNode.top + playAreaMarginY,
        contentNode.right,
        contentNode.bottom - playAreaMarginY
      );

      const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( playAreaViewBounds.left + NumberPlayConstants.BUCKET_SIZE.width / 2, playAreaViewBounds.bottom ),
        1
      );

      const playAreaModelBounds = translateMVT.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );

      const objectsPlayAreaNode = new ObjectsPlayAreaNode(
        objectsPlayArea,
        playAreaModelBounds,
        translateMVT
      );
      contentNode.addChild( objectsPlayAreaNode );

      // create the icons for the RadioButtonGroup
      const buttons = [];
      PlayObjectType.VALUES.forEach( playObjectType => {
        const iconNode = new PlayObjectNode(
          new PlayObject(
            new EnumerationProperty( PlayObjectType, playObjectType ),
            new Vector2( 0, 0 ),
            config.radioButtonSize,
            1
          ),
          playAreaModelBounds,
          translateMVT
        );

        buttons.push( {
          value: playObjectType,
          node: iconNode
        } );
      } );

      // create and add the RadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
      const radioButtonGroup = new RadioButtonGroup( objectsPlayArea.playObjectTypeProperty, buttons, {
        baseColor: Color.WHITE,
        orientation: 'horizontal',
        spacing: config.radioButtonSpacing
      } );
      radioButtonGroup.right = playAreaViewBounds.right - 2; // empirically determined tweak
      radioButtonGroup.bottom = playAreaViewBounds.bottom;
      contentNode.addChild( radioButtonGroup );

      super( contentNode, config );
    }
  }

  return numberPlay.register( 'ObjectsAccordionBox', ObjectsAccordionBox );
} );