// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the `Objects` accordion box on the 'Compare' screen, which mixes the functionality of ObjectsAccordionBox
 * and OnesAccordionBox
 *
 * TODO: Generalize the ObjectsAccordionBox and OnesAccordionBox so that they share code, which will remove the need
 * to use both ObjectsPlayAreaNode and OnesPlayAreaNode. See https://github.com/phetsims/number-play/issues/7
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import BaseNumberNode from '../../../../counting-common/js/common/view/BaseNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Image, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import ComparePlayObjectType from '../model/ComparePlayObjectType.js';

// constants
const WIDTH = 394; // the width of this AccordionBox, in screen coordinates. from the screen's design asset.

const objectsString = numberPlayStrings.objects;

class CompareAccordionBox extends AccordionBox {

  /**
   * @param {ComparePlayArea} playArea
   * @param {number} height - the height of this accordion box
   * @param {Object} [options]
   */
  constructor( playArea, height, options ) {

    options = merge( {
      titleNode: new Text( objectsString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: 344 // empirically determined to not shrink accordion box content
      } ),
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
    const objectsPlayAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top + NumberPlayConstants.PLAY_AREA_Y_MARGIN,
      contentNode.right,
      contentNode.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN
    );

    // create view bounds for the OnesPlayAreaNode
    const onesPlayAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN
    );

    // create and add the ObjectsPlayAreaNode
    const objectsTypeProperty = new DerivedProperty( [ playArea.playObjectTypeProperty ], playObjectType => {
      return playObjectType === ComparePlayObjectType.PAPER_ONE ?
             objectsTypeProperty.value : ComparePlayObjectType[ playObjectType ];
    } );
    const objectsPlayAreaNode = new OnesPlayAreaNode(
      playArea.objectsPlayArea,
      onesPlayAreaViewBounds, {
        playObjectTypeProperty: objectsTypeProperty,
        groupingLinkingTypeProperty: new Property( 'UNGROUPED' )
      }
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create and add the OnesPlayAreaNode
    const onesPlayAreaNode = new OnesPlayAreaNode(
      playArea.onesPlayArea,
      onesPlayAreaViewBounds
    );
    contentNode.addChild( onesPlayAreaNode );

    // create the icons for the RectangularRadioButtonGroup
    const buttons = [];
    ComparePlayObjectType.enumeration.values.forEach( playObjectType => {
      let iconNode = null;
      if ( playObjectType === ComparePlayObjectType.PAPER_ONE ) {
        iconNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1, false );
        iconNode.setScaleMagnitude( options.radioButtonSize.height / iconNode.height / 4 );
      }
      else {
        iconNode = new Image( CountingCommonConstants.PLAY_OBJECT_TYPE_TO_IMAGE[ playObjectType ], {
          maxWidth: options.radioButtonSize.width,
          maxHeight: options.radioButtonSize.height
        } );
      }

      buttons.push( {
        value: playObjectType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the ComparePlayObjectType of this play area
    const radioButtonGroup = new RectangularRadioButtonGroup( playArea.playObjectTypeProperty, buttons, {
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

numberPlay.register( 'CompareAccordionBox', CompareAccordionBox );
export default CompareAccordionBox;