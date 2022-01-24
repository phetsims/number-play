// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import GroupingLinkingType from '../../../../counting-common/js/common/model/GroupingLinkingType.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import { Color, Image, Node, Rectangle, Text } from '../../../../scenery/js/imports.js';
import AccordionBox from '../../../../sun/js/AccordionBox.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants, { AccordionBoxOptions } from '../NumberPlayConstants.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import ComparePlayObjectType from '../../compare/model/ComparePlayObjectType.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import BaseNumberNode from '../../../../counting-common/js/common/view/BaseNumberNode.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';

// types
type CountingAccordionBoxOptions = {
  titleString: string,
  contentWidth: number,
  playObjectTypes: typeof PlayObjectType | typeof ComparePlayObjectType | null,
  linkedPlayArea?: OnesPlayArea | null,
  groupingLinkingTypeProperty?: EnumerationProperty<GroupingLinkingType> | null
} & AccordionBoxOptions;

// constants
const RADIO_BUTTON_SIZE = new Dimension2( 28, 28 );

class CountingAccordionBox extends AccordionBox {
  private readonly playObjectTypeProperty: EnumerationProperty<PlayObjectType>;

  constructor( objectsPlayArea: OnesPlayArea, height: number, providedOptions: Partial<CountingAccordionBoxOptions> ) {

    const options = merge( {
      titleString: numberPlayStrings.objects,
      contentWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_CONTENT_WIDTH,
      playObjectTypes: null,
      linkedPlayArea: null,
      groupingLinkingTypeProperty: null
    }, NumberPlayConstants.ACCORDION_BOX_OPTIONS, providedOptions ) as CountingAccordionBoxOptions;

    const contentNode = new Rectangle( {
      rectHeight: height,
      rectWidth: options.contentWidth
    } );

    const playAreaViewBounds = new Bounds2(
      contentNode.left,
      contentNode.top,
      contentNode.right,
      contentNode.bottom
    );

    // set the local bounds so they don't change
    contentNode.localBounds = playAreaViewBounds;

    // if types were provided, use the first one the default. otherwise default to paper numbers
    const initialPlayObjectType = options.playObjectTypes ? options.playObjectTypes.enumeration!.values[ 0 ] :
                                  CountingObjectType.PAPER_NUMBER;
    const playObjectTypeProperty = new EnumerationProperty( initialPlayObjectType );

    const objectsPlayAreaNode = new OnesPlayAreaNode(
      objectsPlayArea,
      playAreaViewBounds, {
        playObjectTypeProperty: playObjectTypeProperty,
        groupingLinkingTypeProperty: options.groupingLinkingTypeProperty
      }
    );
    contentNode.addChild( objectsPlayAreaNode );

    // TODO-TS: use specific RadioButtonGroup type
    let radioButtonGroup: Node | null = null;
    if ( options.playObjectTypes ) {

      // create the icons for the RectangularRadioButtonGroup
      // @ts-ignore
      const buttons = [];
      options.playObjectTypes.enumeration!.values.forEach( playObjectType => {
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

      // create and add the RectangularRadioButtonGroup, which is a control for changing the PlayObjectType of the playObjects
      // @ts-ignore
      radioButtonGroup = new RectangularRadioButtonGroup( playObjectTypeProperty, buttons, {
        baseColor: Color.WHITE,
        orientation: 'horizontal',
        spacing: 10
      } );
      radioButtonGroup.right = playAreaViewBounds.right - 2; // empirically determined tweak
      radioButtonGroup.bottom = playAreaViewBounds.bottom - NumberPlayConstants.PLAY_AREA_Y_MARGIN;
      contentNode.addChild( radioButtonGroup );
    }

    // add the linked play area
    if ( options.linkedPlayArea && options.groupingLinkingTypeProperty ) {
      const linkedObjectsPlayAreaNode = new OnesPlayAreaNode(
        options.linkedPlayArea,
        playAreaViewBounds, {
          playObjectTypeProperty: playObjectTypeProperty,
          viewHasIndependentModel: false
        }
      );

      options.groupingLinkingTypeProperty.lazyLink( groupingLinkingType => {
        if ( groupingLinkingType === GroupingLinkingType.GROUPED_AND_LINKED ) {
          contentNode.removeChild( objectsPlayAreaNode );
          contentNode.addChild( linkedObjectsPlayAreaNode );
        }
        else if ( contentNode.hasChild( linkedObjectsPlayAreaNode ) ) {
          contentNode.removeChild( linkedObjectsPlayAreaNode );
          contentNode.addChild( objectsPlayAreaNode );
        }
        radioButtonGroup && radioButtonGroup.moveToFront();
      } );
    }

    super( contentNode, merge( {
      titleNode: new Text( options.titleString, {
        font: NumberPlayConstants.ACCORDION_BOX_TITLE_FONT,
        maxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH
      } )
    }, options ) );

    this.playObjectTypeProperty = playObjectTypeProperty;
  }

  /**
   * @public
   */
  reset() {
    this.playObjectTypeProperty.reset();
  }
}

numberPlay.register( 'CountingAccordionBox', CountingAccordionBox );
export default CountingAccordionBox;