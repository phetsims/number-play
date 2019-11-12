// Copyright 2019, University of Colorado Boulder

/**
 * Class for the `Objects` accordion box on the 'Compare' screen, which mixes the functionality of ObjectsAccordionBox
 * and OnesAccordionBox
 *
 * TODO: Generalize the ObjectsAccordionBox and OnesAccordionBox so that they share code, which will remove the need
 * to use both ObjectsPlayAreaNode and OnesPlayAreaNode.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const AccordionBox = require( 'SUN/AccordionBox' );
  const BaseNumber = require( 'MAKE_A_TEN/make-a-ten/common/model/BaseNumber' );
  const BaseNumberNode = require( 'MAKE_A_TEN/make-a-ten/common/view/BaseNumberNode' );
  const Bounds2 = require( 'DOT/Bounds2' );
  const ComparePlayObjectType = require( 'NUMBER_PLAY/compare/model/ComparePlayObjectType' );
  const Color = require( 'SCENERY/util/Color' );
  const Dimension2 = require( 'DOT/Dimension2' );
  const EnumerationProperty = require( 'AXON/EnumerationProperty' );
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObjectsPlayAreaNode = require( 'NUMBER_PLAY/common/view/ObjectsPlayAreaNode' );
  const OnesPlayAreaNode = require( 'NUMBER_PLAY/common/view/OnesPlayAreaNode' );
  const PlayObject = require( 'NUMBER_PLAY/common/model/PlayObject' );
  const PlayObjectNode = require( 'NUMBER_PLAY/common/view/PlayObjectNode' );
  const RadioButtonGroup = require( 'SUN/buttons/RadioButtonGroup' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const WIDTH = 394; // the width of this AccordionBox, in screen coordinates. from the screen's design asset.

  // strings
  const objectsString = require( 'string!NUMBER_PLAY/objects' );

  class CompareAccordionBox extends AccordionBox {

    /**
     * @param {ComparePlayArea} playArea
     * @param {number} height - the height of this accordion box
     * @param {Object} [options]
     */
    constructor( playArea, height, options ) {

      options = merge( {
        titleNode: new Text( objectsString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
        fill: NumberPlayConstants.BLUE_BACKGROUND,
        minWidth: WIDTH,
        maxWidth: WIDTH,

        contentWidth: 350, // {number}
        radioButtonSize: new Dimension2( 28, 28 ), // {Dimension2}
        radioButtonSpacing: 10 // {number}
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, options );

      const contentNode = new Rectangle( {
        rectHeight: height,
        rectWidth: options.contentWidth
      } );

      // create view bounds for the ObjectsPlayAreaNode
      const playAreaMarginY = 15;
      const objectsPlayAreaViewBounds = new Bounds2(
        contentNode.left,
        contentNode.top + playAreaMarginY,
        contentNode.right,
        contentNode.bottom - playAreaMarginY
      );
      const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( objectsPlayAreaViewBounds.left + NumberPlayConstants.BUCKET_SIZE.width / 2, objectsPlayAreaViewBounds.bottom ),
        1
      );
      const playAreaModelBounds = translateMVT.viewToModelBounds( objectsPlayAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );

      // create and add the ObjectsPlayAreaNode
      const objectsPlayAreaNode = new ObjectsPlayAreaNode(
        playArea.objectsPlayArea,
        playAreaModelBounds,
        translateMVT
      );
      contentNode.addChild( objectsPlayAreaNode );

      // create view bounds for the OnesPlayAreaNode
      const onesPlayAreaViewBounds = new Bounds2(
        contentNode.left,
        contentNode.top,
        contentNode.right,
        contentNode.bottom - playAreaMarginY
      );

      // create and add the OnesPlayAreaNode
      const onesPlayAreaNode = new OnesPlayAreaNode(
        playArea.onesPlayArea,
        onesPlayAreaViewBounds,
        translateMVT
      );
      contentNode.addChild( onesPlayAreaNode );

      // create the icons for the RadioButtonGroup
      const buttons = [];
      ComparePlayObjectType.VALUES.forEach( playObjectType => {
        let iconNode = null;
        if ( playObjectType === ComparePlayObjectType.PAPER_ONE ) {
          iconNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1 );
          iconNode.setScaleMagnitude( options.radioButtonSize.height / iconNode.height / 4 );
        }
        else {
          iconNode = new PlayObjectNode(
            new PlayObject(
              new EnumerationProperty( ComparePlayObjectType, playObjectType ),
              new Vector2( 0, 0 ),
              options.radioButtonSize,
              1
            ),
            playAreaModelBounds,
            translateMVT
          );
        }

        buttons.push( {
          value: playObjectType,
          node: iconNode
        } );
      } );

      // create and add the RadioButtonGroup, which is a control for changing the ComparePlayObjectType of this play area
      const radioButtonGroup = new RadioButtonGroup( playArea.playObjectTypeProperty, buttons, {
        baseColor: Color.WHITE,
        orientation: 'horizontal',
        spacing: options.radioButtonSpacing
      } );
      radioButtonGroup.right = objectsPlayAreaViewBounds.right - 2; // empirically determined tweak
      radioButtonGroup.bottom = objectsPlayAreaViewBounds.bottom;
      contentNode.addChild( radioButtonGroup );

      // since (for now) there are two underlying play areas in place of one, hide and show whichever is appropriate
      // based on the value of playObjectTypeProperty
      playArea.playObjectTypeProperty.link( type => {
        if ( type === ComparePlayObjectType.PAPER_ONE ) {
          objectsPlayAreaNode.visible = false;
          onesPlayAreaNode.visible = true;
        }
        else {
          onesPlayAreaNode.visible = false;
          objectsPlayAreaNode.visible = true;
        }
      } );

      super( contentNode, options );
    }
  }

  return numberPlay.register( 'CompareAccordionBox', CompareAccordionBox );
} );