// Copyright 2019-2022, University of Colorado Boulder

/**
 * Class for the 'Objects' accordion box, which is the panel in the lower right corner of the sim that displays an
 * environment for counting with various objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import CountingObjectType from '../../../../counting-common/js/common/model/CountingObjectType.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { Color, Image, Node } from '../../../../scenery/js/imports.js';
import RectangularRadioButtonGroup from '../../../../sun/js/buttons/RectangularRadioButtonGroup.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import BaseNumberNode from '../../../../counting-common/js/common/view/BaseNumberNode.js';
import BaseNumber from '../../../../counting-common/js/common/model/BaseNumber.js';
import GroupAndLinkType from '../model/GroupAndLinkType.js';
import NumberPlayAccordionBox, { NumberPlayAccordionBoxOptions } from './NumberPlayAccordionBox.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type CountingAccordionBoxSelfOptions = {
  countingObjectTypes?: CountingObjectType[] | null,
  linkedPlayArea?: OnesPlayArea | null,
  groupAndLinkTypeProperty?: EnumerationProperty<GroupAndLinkType>
};
type CountingAccordionBoxOptions = CountingAccordionBoxSelfOptions & NumberPlayAccordionBoxOptions;

// constants
const RADIO_BUTTON_SIZE = new Dimension2( 28, 28 ); // in screen coordinates

class CountingAccordionBox extends NumberPlayAccordionBox {

  constructor( playArea: OnesPlayArea,
               countingObjectTypeProperty: EnumerationProperty<CountingObjectType>,
               width: number,
               height: number,
               options: CountingAccordionBoxOptions ) {

    super( width, height, optionize<CountingAccordionBoxOptions, CountingAccordionBoxSelfOptions, NumberPlayAccordionBoxOptions>( {
      titleString: numberPlayStrings.objects,
      titleMaxWidth: NumberPlayConstants.LOWER_ACCORDION_BOX_TITLE_MAX_WIDTH,
      countingObjectTypes: null,
      linkedPlayArea: null,
      groupAndLinkTypeProperty: new EnumerationProperty( GroupAndLinkType.GROUPED )
    }, options ) );

    const objectsPlayAreaNode = new OnesPlayAreaNode( playArea, countingObjectTypeProperty, this.contentBounds );
    this.contentNode.addChild( objectsPlayAreaNode );

    // TODO-TS: use specific RadioButtonGroup type
    let radioButtonGroup: Node | null = null;
    if ( options.countingObjectTypes ) {

      // create the icons for the RectangularRadioButtonGroup
      // @ts-ignore
      const buttons = [];
      options.countingObjectTypes.forEach( countingObjectType => {
        let iconNode = null;
        if ( countingObjectType === CountingObjectType.PAPER_NUMBER ) {
          iconNode = new BaseNumberNode( new BaseNumber( 1, 0 ), 1 );
          iconNode.setScaleMagnitude( RADIO_BUTTON_SIZE.height / iconNode.height );
        }
        else {
          iconNode = new Image( CountingCommonConstants.COUNTING_OBJECT_TYPE_TO_IMAGE.get( countingObjectType ), {
            maxWidth: RADIO_BUTTON_SIZE.width,
            maxHeight: RADIO_BUTTON_SIZE.height
          } );
        }

        buttons.push( {
          value: countingObjectType,
          node: iconNode
        } );
      } );

      // create and add the RectangularRadioButtonGroup, which is a control for changing the CountingObjectType of the playObjects
      // @ts-ignore
      radioButtonGroup = new RectangularRadioButtonGroup( countingObjectTypeProperty, buttons, {
        baseColor: Color.WHITE,
        orientation: 'horizontal',
        spacing: 10
      } );
      radioButtonGroup.right = this.contentBounds.right - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
      radioButtonGroup.bottom = this.contentBounds.bottom - CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN;
      this.contentNode.addChild( radioButtonGroup );
    }

    // add the linked play area
    if ( options.linkedPlayArea && options.groupAndLinkTypeProperty ) {
      const linkedObjectsPlayAreaNode = new OnesPlayAreaNode(
        options.linkedPlayArea,
        countingObjectTypeProperty,
        this.contentBounds, {
          viewHasIndependentModel: false
        }
      );
      this.contentNode.addChild( linkedObjectsPlayAreaNode );

      options.groupAndLinkTypeProperty.link( groupAndLinkType => {
        objectsPlayAreaNode.visible = !( groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED );
        linkedObjectsPlayAreaNode.visible = groupAndLinkType === GroupAndLinkType.GROUPED_AND_LINKED;
        radioButtonGroup && radioButtonGroup.moveToFront();
      } );
    }
  }
}

numberPlay.register( 'CountingAccordionBox', CountingAccordionBox );
export default CountingAccordionBox;