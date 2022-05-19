// Copyright 2021-2022, University of Colorado Boulder

/**
 * Panel that contains a stack of  paper ones or objects, which can be clicked or dragged to create draggable
 * paper ones or objects. It also contains spinner buttons that can send a paper one or object out of the panel, or
 * request them to be brought back into the panel.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCreatorNode from '../../../../counting-common/js/common/view/CountingCreatorNode.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { HBox, Rectangle, VBox } from '../../../../scenery/js/imports.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import numberPlay from '../../numberPlay.js';
import OnesPlayArea from '../model/OnesPlayArea.js';
import OnesPlayAreaNode from './OnesPlayAreaNode.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import NumberPlayConstants from '../NumberPlayConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';

// types
type SelfOptions = {};
export type OnesCreatorPanelOptions = SelfOptions & PanelOptions;

class OnesCreatorPanel extends Panel {
  public countingCreatorNode: CountingCreatorNode;

  constructor( playArea: OnesPlayArea, screenView: OnesPlayAreaNode, providedOptions?: OnesCreatorPanelOptions ) {

    const options = optionize<OnesCreatorPanelOptions, SelfOptions, PanelOptions>()( {
      stroke: 'rgb(201,203,203)',
      xMargin: 8,
      yMargin: 8
    }, providedOptions );

    // create the arrow buttons, which change the value of currentNumberProperty by -1 or +1
    const arrowButtonConfig = {
      arrowWidth: 14,  // empirically determined
      arrowHeight: 14, // empirically determined
      spacing: 7       // empirically determined
    };
    const upArrowButton = new ArrowButton( 'up', () => {
      playArea.currentNumberProperty.value =
        Math.min( playArea.currentNumberProperty.range!.max, playArea.currentNumberProperty.value + 1 );
    }, merge( { touchAreaYShift: -3 }, arrowButtonConfig ) );
    const downArrowButton = new ArrowButton( 'down', () => {
      playArea.currentNumberProperty.value =
        Math.max( playArea.currentNumberProperty.range!.min, playArea.currentNumberProperty.value - 1 );
    }, merge( { touchAreaYShift: 3 }, arrowButtonConfig ) );
    const arrowButtons = new VBox( {
      children: [ upArrowButton, downArrowButton ],
      spacing: arrowButtonConfig.spacing
    } );

    const creatorNodeBackground = new Rectangle( 0, 0,
      CountingCommonConstants.PLAY_OBJECT_SIZE.width * NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE + 8,
      CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height * NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE + 5
    );

    // @ts-ignore TODO-TS: Remove if/when OnesPlayAreaNode extends CountingCommonView
    const countingCreatorNode = new CountingCreatorNode( 0, screenView, playArea.sumProperty, playArea.resetEmitter, {
      updateCurrentNumber: true,
      countingObjectTypeProperty: screenView.countingObjectTypeProperty,
      groupingEnabledProperty: screenView.playArea.groupingEnabledProperty,
      backTargetOffset: new Vector2( -5, -5 ),
      ungroupedTargetScale: NumberPlayConstants.UNGROUPED_STORED_COUNTING_OBJECT_SCALE,
      groupedTargetScale: NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE,
      touchAreaXDilation: 6.5,
      touchAreaYDilation: 5,
      touchAreaXShift: 3
    } );
    creatorNodeBackground.addChild( countingCreatorNode );

    screenView.playArea.groupingEnabledProperty.link( groupingEnabled => {
      countingCreatorNode.center = creatorNodeBackground.selfBounds.center;
    } );

    const hBox = new HBox( {
      children: [ arrowButtons, creatorNodeBackground ],
      spacing: 11,
      align: 'center'
    } );

    super( hBox, options );

    this.countingCreatorNode = countingCreatorNode;

    // disable the arrow buttons when the currentNumberProperty value is at its min or max range
    const currentNumberPropertyObserver = ( currentNumber: number ) => {
      upArrowButton.enabled = currentNumber !== playArea.currentNumberProperty.range!.max;
      downArrowButton.enabled = currentNumber !== playArea.currentNumberProperty.range!.min;
    };
    playArea.currentNumberProperty.link( currentNumberPropertyObserver );
  }
}

numberPlay.register( 'OnesCreatorPanel', OnesCreatorPanel );
export default OnesCreatorPanel;
