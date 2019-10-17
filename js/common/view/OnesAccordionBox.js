// Copyright 2019, University of Colorado Boulder

/**
 * Class for the 'Ones' accordion box, which is the panel in the lower left corner of the sim that displays an
 * environment for counting with ones.
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
  const OnesPlayAreaNode = require( 'NUMBER_PLAY/common/view/OnesPlayAreaNode' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Vector2 = require( 'DOT/Vector2' );

  // strings
  const onesString = require( 'string!NUMBER_PLAY/ones' );

  class OnesAccordionBox extends AccordionBox {

    /**
     * @param {OnesPlayArea} onesPlayArea
     * @param {number} height - the height of this accordion box
     * @param {Object} [options]
     */
    constructor( onesPlayArea, height, config ) {

      config = merge( {
        titleNode: new Text( onesString, { font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT } ),
        fill: NumberPlayConstants.PURPLE_BACKGROUND,

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
        contentNode.top,
        contentNode.right,
        contentNode.bottom - playAreaMarginY
      );

      const translateMVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping(
        Vector2.ZERO,
        new Vector2( playAreaViewBounds.centerX, playAreaViewBounds.bottom ),
        1
      );

      const onesPlayAreaNode = new OnesPlayAreaNode(
        onesPlayArea,
        playAreaViewBounds.dilatedX( -10 ),
        translateMVT
      );
      contentNode.addChild( onesPlayAreaNode );

      super( contentNode, config );
    }
  }

  return numberPlay.register( 'OnesAccordionBox', OnesAccordionBox );
} );