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
  const merge = require( 'PHET_CORE/merge' );
  const ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const NumberPlayConstants = require( 'NUMBER_PLAY/common/NumberPlayConstants' );
  const ObjectsPlayAreaNode = require( 'NUMBER_PLAY/common/view/ObjectsPlayAreaNode' );
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

        contentWidth: null // {number} @required
      }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, config );

      assert && assert( config.contentWidth, `contentWidth is required: ${config.contentWidth}`);

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
        new Vector2( playAreaViewBounds.centerX, playAreaViewBounds.bottom ),
        1
      );

      const playAreaModelBounds = translateMVT.viewToModelBounds( playAreaViewBounds ).dilatedX( -20 ).dilatedY( -19 );

      const objectsPlayAreaNode = new ObjectsPlayAreaNode(
        objectsPlayArea,
        playAreaModelBounds,
        translateMVT
      );
      contentNode.addChild( objectsPlayAreaNode );

      super( contentNode, config );
    }
  }

  return numberPlay.register( 'ObjectsAccordionBox', ObjectsAccordionBox );
} );