// Copyright 2022, University of Colorado Boulder

/**
 * Panel for creating inequality symbol cards.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Rectangle, VBox } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import LabModel from '../model/LabModel.js';
import LabScreenView from './LabScreenView.js';
import NumberPlayCreatorPanel from '../../common/view/NumberPlayCreatorPanel.js';
import SymbolCardNode, { SymbolType } from './SymbolCardNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import CardCreatorNode from './CardCreatorNode.js';
import Property from '../../../../axon/js/Property.js';

// constants
const MAX_SYMBOL_PIECE_COUNT = 10;
const SPACING = 10;

class SymbolCardCreatorPanel extends NumberPlayCreatorPanel {
  private readonly lessThanNodeCountProperty: Property<number>;
  private readonly equalNodeCountProperty: Property<number>;
  private readonly greaterThanNodeCountProperty: Property<number>;
  private readonly plusNodeCountProperty: Property<number>;
  private readonly minusNodeCountProperty: Property<number>;
  private readonly clearSymbolNodes: () => void;
  private readonly screenView: LabScreenView;

  public constructor( model: LabModel, screenView: LabScreenView ) {

    const creatorNodeBackground = new Rectangle( 0, 0,
      SymbolCardNode.WIDTH,
      ( SymbolCardNode.WIDTH + SPACING ) * 5 + SPACING * 2
    );

    // Properties to count the number of each type of symbol node
    const lessThanNodeCountProperty = new NumberProperty( 0 );
    const equalNodeCountProperty = new NumberProperty( 0 );
    const greaterThanNodeCountProperty = new NumberProperty( 0 );
    const plusNodeCountProperty = new NumberProperty( 0 );
    const minusNodeCountProperty = new NumberProperty( 0 );

    // create a map from SymbolType to countProperty
    const symbolToCountPropertyMap = new Map<SymbolType, TProperty<number>>();
    symbolToCountPropertyMap.set( '<', lessThanNodeCountProperty );
    symbolToCountPropertyMap.set( '=', equalNodeCountProperty );
    symbolToCountPropertyMap.set( '>', greaterThanNodeCountProperty );
    symbolToCountPropertyMap.set( '+', plusNodeCountProperty );
    symbolToCountPropertyMap.set( '-', minusNodeCountProperty );

    // make a creator node for each SymbolNode type
    const lessThanCreatorNode = new CardCreatorNode( screenView, symbolToCountPropertyMap, {
      symbolType: '<'
    } );
    const equalCreatorNode = new CardCreatorNode( screenView, symbolToCountPropertyMap, {
      symbolType: '='
    } );
    const greaterThanCreatorNode = new CardCreatorNode( screenView, symbolToCountPropertyMap, {
      symbolType: '>'
    } );
    const plusCreatorNode = new CardCreatorNode( screenView, symbolToCountPropertyMap, {
      symbolType: '+'
    } );
    const minusCreatorNode = new CardCreatorNode( screenView, symbolToCountPropertyMap, {
      symbolType: '-'
    } );

    const iconNodes = new VBox( {
      children: [
        lessThanCreatorNode,
        equalCreatorNode,
        greaterThanCreatorNode,
        plusCreatorNode,
        minusCreatorNode
      ],
      spacing: SPACING,
      resize: false // don't shift contents when one of the creator nodes is hidden
    } );

    iconNodes.center = creatorNodeBackground.center;
    creatorNodeBackground.addChild( iconNodes );

    super( creatorNodeBackground, {
      xMargin: 10
    } );

    this.screenView = screenView;

    this.lessThanNodeCountProperty = lessThanNodeCountProperty;
    this.equalNodeCountProperty = equalNodeCountProperty;
    this.greaterThanNodeCountProperty = greaterThanNodeCountProperty;
    this.plusNodeCountProperty = plusNodeCountProperty;
    this.minusNodeCountProperty = minusNodeCountProperty;

    // make a creator node invisible if the max number for its type has been created
    this.lessThanNodeCountProperty.link( count => { lessThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.equalNodeCountProperty.link( count => { equalCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.greaterThanNodeCountProperty.link( count => { greaterThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.plusNodeCountProperty.link( count => { greaterThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.minusNodeCountProperty.link( count => { greaterThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );

    // removes and disposes all types of symbol nodes
    this.clearSymbolNodes = () => {
      const allSymbolNodes = this.getAllSymbolNodes();
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
    this.plusNodeCountProperty.reset();
    this.minusNodeCountProperty.reset();
  }

  public getAllSymbolNodes(): SymbolCardNode[] {
    const allSymbolNodes = _.filter( this.screenView.pieceLayer.children,
      child => child instanceof SymbolCardNode ) as SymbolCardNode[];
    return allSymbolNodes;
  }
}

numberPlay.register( 'SymbolCardCreatorPanel', SymbolCardCreatorPanel );
export default SymbolCardCreatorPanel;
