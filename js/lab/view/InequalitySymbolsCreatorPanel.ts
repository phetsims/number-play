// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { DragListener, HBox, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import LabModel from '../model/LabModel.js';
import LabScreenView from './LabScreenView.js';
import NumberPlayCreatorPanel from '../../common/view/NumberPlayCreatorPanel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import InequalitySymbolNode, { SymbolType } from './InequalitySymbolNode.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';

// constants
const MAX_SYMBOL_PIECE_COUNT = 10;
const SPACING = 10;

class InequalitySymbolsCreatorPanel extends NumberPlayCreatorPanel {
  private readonly lessThanNodeCountProperty: NumberProperty;
  private readonly equalNodeCountProperty: NumberProperty;
  private readonly greaterThanNodeCountProperty: NumberProperty;
  private readonly clearSymbolNodes: () => void;

  public constructor( model: LabModel, screenView: LabScreenView ) {

    // creates a creator node for the given SymbolType type
    const createCreatorIcon = ( symbol: SymbolType ) => {
      const iconNode = new InequalitySymbolNode( {
        symbolType: symbol,
        includeDragListener: false
      } );

      iconNode.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
        const countProperty = symbolToCountPropertyMap.get( symbol );
        assert && assert( countProperty, 'countProperty for inequality symbol not found: ' + symbol );
        countProperty!.value++;

        const inequalitySymbolNode = new InequalitySymbolNode( {
          symbolType: symbol,
          dropListener: () => {
            if ( inequalitySymbolNode.bounds.intersectsBounds( screenView.inequalitySymbolsCreatorPanel.bounds ) ) {
              inequalitySymbolNode.inputEnabled = false;

              // calculate icon's origin
              let trail = screenView.getUniqueLeafTrailTo( iconNode );
              trail = trail.slice( 1, trail.length );
              const globalOrigin = trail.localToGlobalPoint( iconNode.localBounds.center );

              const removeAnimation = new Animation( {
                duration: 0.3,
                targets: [ {
                  property: inequalitySymbolNode.positionProperty,
                  easing: Easing.CUBIC_IN_OUT,
                  to: globalOrigin
                } ]
              } );

              removeAnimation.finishEmitter.addListener( () => {
                screenView.pieceLayer.removeChild( inequalitySymbolNode );
                inequalitySymbolNode.dispose();
                countProperty!.value--;
              } );
              removeAnimation.start();
            }
          }
        } );
        screenView.pieceLayer.addChild( inequalitySymbolNode );
        inequalitySymbolNode.positionProperty.value = screenView.globalToLocalPoint( event.pointer.point ).minus( inequalitySymbolNode.localBounds.centerBottom.minusXY( 0, 15 ) );
        inequalitySymbolNode.dragListener!.press( event, inequalitySymbolNode );
      } ) );

      return iconNode;
    };

    const creatorNodeBackground = new Rectangle( 0, 0,
      InequalitySymbolNode.SIDE_LENGTH * 3 + SPACING * 2,
      // TODO: Factor out with OnesCreatorPanel
      CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height * NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE + 5
    );

    // make a creator node for each SymbolNode type
    const lessThanCreatorNode = createCreatorIcon( '<' );
    const equalCreatorNode = createCreatorIcon( '=' );
    const greaterThanCreatorNode = createCreatorIcon( '>' );

    const iconNodes = new HBox( {
      children: [
        lessThanCreatorNode,
        equalCreatorNode,
        greaterThanCreatorNode
      ],
      spacing: SPACING,
      resize: false // don't shift contents when one of the creator nodes is hidden
    } );

    iconNodes.center = creatorNodeBackground.center;
    creatorNodeBackground.addChild( iconNodes );

    super( creatorNodeBackground, {
      xMargin: 10
    } );

    // Properties to count the number of each type of symbol node
    this.lessThanNodeCountProperty = new NumberProperty( 0 );
    this.equalNodeCountProperty = new NumberProperty( 0 );
    this.greaterThanNodeCountProperty = new NumberProperty( 0 );

    // make a creator node invisible if the max number for its type has been created
    this.lessThanNodeCountProperty.link( count => { lessThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.equalNodeCountProperty.link( count => { equalCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.greaterThanNodeCountProperty.link( count => { greaterThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );

    // create a map from SymbolType to countProperty
    const symbolToCountPropertyMap = new Map<SymbolType, TProperty<number>>();
    symbolToCountPropertyMap.set( '<', this.lessThanNodeCountProperty );
    symbolToCountPropertyMap.set( '=', this.equalNodeCountProperty );
    symbolToCountPropertyMap.set( '>', this.greaterThanNodeCountProperty );

    // removes and disposes all types of symbol nodes
    this.clearSymbolNodes = () => {
      const allSymbolNodes = _.filter( screenView.pieceLayer.children,
          child => child instanceof InequalitySymbolNode ) as InequalitySymbolNode[];
      allSymbolNodes.forEach( symbolNode => {
        screenView.pieceLayer.removeChild( symbolNode );
        symbolNode.dispose();
      } );
    };
  }

  public reset(): void {
    this.clearSymbolNodes();
    this.lessThanNodeCountProperty.reset();
    this.equalNodeCountProperty.reset();
    this.greaterThanNodeCountProperty.reset();
  }
}

numberPlay.register( 'InequalitySymbolsCreatorPanel', InequalitySymbolsCreatorPanel );
export default InequalitySymbolsCreatorPanel;
