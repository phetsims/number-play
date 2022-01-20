// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the `Objects` accordion box on the 'Compare' screen, which mixes the functionality of ObjectsAccordionBox
 * and OnesAccordionBox
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import BaseNumberNode from '../../../../counting-common/js/common/view/BaseNumberNode.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Image, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../../common/NumberPlayConstants.js';
import OnesPlayAreaNode from '../../common/view/OnesPlayAreaNode.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import ComparePlayObjectType from '../model/ComparePlayObjectType.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import OnesPlayArea from '../../common/model/OnesPlayArea.js';

// constants
const RADIO_BUTTON_SIZE = new Dimension2( 28, 28 );
const RADIO_BUTTON_SPACING = 10;
const CONTENT_WIDTH = 350; // in screen coordinates

const objectsString = numberPlayStrings.objects;

class CompareAccordionBox extends AccordionBox {

  constructor( playArea: OnesPlayArea, height: number, providedOptions: Partial<AccordionBoxOptions> ) {

    const options = merge( {
      titleNode: new Text( objectsString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: 344 // empirically determined to not shrink accordion box content
      } )
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, providedOptions ) as AccordionBoxOptions;

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: CONTENT_WIDTH
    } );

    // create view bounds for the OnesPlayAreaNode
    const playAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom
    );

    // set the local bounds explicitly so they don't change
    contentNode.localBounds = playAreaViewBounds;

    const playObjectTypeProperty = new EnumerationProperty( ComparePlayObjectType.DOG );

    // create and add the ObjectsPlayAreaNode
    const objectsPlayAreaNode = new OnesPlayAreaNode(
      playArea,
      playAreaViewBounds, {
        playObjectTypeProperty: playObjectTypeProperty
      }
    );
    contentNode.addChild( objectsPlayAreaNode );

    // create the icons for the RectangularRadioButtonGroup
    // @ts-ignore TODO-TS: get type from RectangularRadioButtonGroup
    const buttons = [];
    ComparePlayObjectType.enumeration.values.forEach( playObjectType => {
      let iconNode = null;
      if ( playObjectType === ComparePlayObjectType.PAPER_NUMBER ) {
        iconNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1 );
        iconNode.setScaleMagnitude( RADIO_BUTTON_SIZE.height / iconNode.height / 4 );
      }
      else {
        iconNode = new Image( CountingCommonConstants.PLAY_OBJECT_TYPE_TO_IMAGE.get( playObjectType.name ), {
          maxWidth: RADIO_BUTTON_SIZE.width,
          maxHeight: RADIO_BUTTON_SIZE.height
        } );
      }

      buttons.push( {
        value: playObjectType,
        node: iconNode
      } );
    } );

    // create and add the RectangularRadioButtonGroup, which is a control for changing the ComparePlayObjectType of this play area
    // @ts-ignore TODO-TS: will be typed when used from RectangularRadioButtonGroup above
    const radioButtonGroup = new RectangularRadioButtonGroup( playObjectTypeProperty, buttons, {
      baseColor: Color.WHITE,
      orientation: 'horizontal',
      spacing: RADIO_BUTTON_SPACING
    } );
    radioButtonGroup.right = playAreaViewBounds.right - 2; // empirically determined tweak
    radioButtonGroup.bottom = playAreaViewBounds.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN;
    contentNode.addChild( radioButtonGroup );

    super( contentNode, options );
  }
}

numberPlay.register( 'CompareAccordionBox', CompareAccordionBox );
export default CompareAccordionBox;