// Copyright 2022, University of Colorado Boulder

/**
 * Panel for creating symbol cards.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Rectangle, VBox, Node } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import LabModel from '../model/LabModel.js';
import LabScreenView from './LabScreenView.js';
import NumberPlayCreatorPanel from '../../common/view/NumberPlayCreatorPanel.js';
import SymbolCardNode, { SymbolType } from './SymbolCardNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CardCreatorNode from './CardCreatorNode.js';
import Property from '../../../../axon/js/Property.js';

// constants
const MAX_SYMBOL_PIECE_COUNT = 10;
const SPACING = 10;

class SymbolCardCreatorPanel extends NumberPlayCreatorPanel {
  private readonly symbolTypeToCountPropertyMap: Map<SymbolType, Property<number>>;
  private readonly clearSymbolNodes: () => void;
  private readonly screenView: LabScreenView;

  public constructor( model: LabModel, screenView: LabScreenView, symbolTypes: SymbolType[] ) {

    const cardsHeight = ( SymbolCardNode.WIDTH + SPACING ) * symbolTypes.length;
    const yMargin = symbolTypes.length > 3 ? SPACING * 2 : SPACING;
    const creatorNodeBackground = new Rectangle( 0, 0, SymbolCardNode.WIDTH, cardsHeight + yMargin );

    // create a map from SymbolType to countProperty
    const symbolTypeToCountPropertyMap = new Map<SymbolType, Property<number>>();
    const symbolTypeToCreatorNodeMap = new Map<SymbolType, Node>();

    symbolTypes.forEach( symbolType => {

      // Property to count the number of each type of symbol node
      const countProperty = new NumberProperty( 0 );
      symbolTypeToCountPropertyMap.set( symbolType, countProperty );

      // make a creator node for the SymbolNode type
      const creatorNode = new CardCreatorNode( screenView, symbolTypeToCountPropertyMap, {
        symbolType: symbolType
      } );
      symbolTypeToCreatorNodeMap.set( symbolType, creatorNode );
    } );

    const iconNodes = new VBox( {
      children: [ ...Array.from( symbolTypeToCreatorNodeMap.values() ) ],
      spacing: SPACING,
      resize: false // don't shift contents when one of the creator nodes is hidden
    } );

    iconNodes.center = creatorNodeBackground.center;
    creatorNodeBackground.addChild( iconNodes );

    super( creatorNodeBackground, {
      xMargin: 10
    } );

    this.screenView = screenView;
    this.symbolTypeToCountPropertyMap = symbolTypeToCountPropertyMap;

    // make a creator node invisible if the max number for its type has been created
    symbolTypeToCountPropertyMap.forEach( ( countProperty, symbolType ) => {
      assert && assert( symbolTypeToCreatorNodeMap.has( symbolType ), `Node not found for symbolType: ${symbolType}` );
      countProperty.link( count => {
        symbolTypeToCreatorNodeMap.get( symbolType )!.visible = count < MAX_SYMBOL_PIECE_COUNT;
      } );
    } );

    // removes and disposes all types of symbol nodes
    this.clearSymbolNodes = () => {
      const allSymbolNodes = this.getAllSymbolNodes();
      allSymbolNodes.forEach( symbolNode => {
        screenView.pieceLayer.removeChild( symbolNode );
        symbolNode.dispose();
      } );
    };
  }

  /**
   * Clears all cards and resets their counts.
   */
  public reset(): void {
    this.clearSymbolNodes();
    this.symbolTypeToCountPropertyMap.forEach( countProperty => {
      countProperty.reset();
    } );
  }

  /**
   * Returns all existing cards in the play area.
   */
  public getAllSymbolNodes(): SymbolCardNode[] {
    const allSymbolNodes = _.filter( this.screenView.pieceLayer.children,
      child => child instanceof SymbolCardNode ) as SymbolCardNode[];
    return allSymbolNodes;
  }
}

numberPlay.register( 'SymbolCardCreatorPanel', SymbolCardCreatorPanel );
export default SymbolCardCreatorPanel;
