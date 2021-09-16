// Copyright 2021, University of Colorado Boulder

/**
 * Panel that contains a stack of  paper ones or objects, which can be clicked or dragged to create draggable
 * paper ones or objects. It also contains spinner buttons that can send a paper one or object out of the panel, or
 * request them to be brought back into the panel.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCreatorNode from '../../../../counting-common/js/common/view/CountingCreatorNode.js';
import merge from '../../../../phet-core/js/merge.js';
import HBox from '../../../../scenery/js/nodes/HBox.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import ArrowButton from '../../../../sun/js/buttons/ArrowButton.js';
import Panel from '../../../../sun/js/Panel.js';
import numberPlay from '../../numberPlay.js';

class OnesCreatorPanel extends Panel {
  /**
   * @param {MakeATenExploreScreenView} screenView
   * @param {NumberProperty} sumProperty
   * @param {Object} [options] - Passed to Node
   */
  constructor( playArea, screenView, options ) {

    options = merge( {
      stroke: 'rgb(201,203,203)',
      xMargin: 8,
      yMargin: 8
    }, options );

    // create the arrow buttons, which change the value of currentNumberProperty by -1 or +1
    const arrowButtonConfig = {
      arrowWidth: 14,  // empirically determined
      arrowHeight: 14, // empirically determined
      spacing: 6       // empirically determined
    };
    const upArrowButton = new ArrowButton( 'up', () => {
      playArea.currentNumberProperty.value =
        Math.min( playArea.currentNumberProperty.range.max, playArea.currentNumberProperty.value + 1 );
    }, arrowButtonConfig );
    const downArrowButton = new ArrowButton( 'down', () => {
      playArea.currentNumberProperty.value =
        Math.max( playArea.currentNumberProperty.range.min, playArea.currentNumberProperty.value - 1 );
    }, arrowButtonConfig );
    const arrowButtons = new VBox( {
      children: [ upArrowButton, downArrowButton ],
      spacing: arrowButtonConfig.spacing
    } );

    const countingCreatorNode = new CountingCreatorNode( 0, screenView, playArea.sumProperty, {
      updateCurrentNumber: true,
      playObjectTypeProperty: screenView.playObjectTypeProperty
    } );

    const hBox = new HBox( {
      children: [ arrowButtons, countingCreatorNode ],
      spacing: 16,
      align: 'center'
    } );

    super( hBox, options );

    // @public (read-only) {CountingCreatorNode}
    this.countingCreatorNode = countingCreatorNode;

    // disable the arrow buttons when the currentNumberProperty value is at its min or max range
    const currentNumberPropertyObserver = currentNumber => {
      upArrowButton.enabled = currentNumber !== playArea.currentNumberProperty.range.max;
      downArrowButton.enabled = currentNumber !== playArea.currentNumberProperty.range.min;
    };
    playArea.currentNumberProperty.link( currentNumberPropertyObserver );
  }
}

numberPlay.register( 'OnesCreatorPanel', OnesCreatorPanel );
export default OnesCreatorPanel;
