// Copyright 2022, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { HBox, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import LabModel from '../model/LabModel.js';
import LabScreenView from './LabScreenView.js';
import NumberPlayCreatorPanel from '../../common/view/NumberPlayCreatorPanel.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import InequalitySymbolCardNode, { SymbolType } from './InequalitySymbolCardNode.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';
import CardCreatorNode from './CardCreatorNode.js';
import Property from '../../../../axon/js/Property.js';

// constants
const MAX_SYMBOL_PIECE_COUNT = 10;
const SPACING = 10;

class InequalitySymbolCardCreatorPanel extends NumberPlayCreatorPanel {
  private readonly lessThanNodeCountProperty: Property<number>;
  private readonly equalNodeCountProperty: NumberProperty;
  private readonly greaterThanNodeCountProperty: NumberProperty;
  private readonly clearSymbolNodes: () => void;
  private readonly screenView: LabScreenView;

  public constructor( model: LabModel, screenView: LabScreenView ) {

    const creatorNodeBackground = new Rectangle( 0, 0,
      InequalitySymbolCardNode.WIDTH * 3 + SPACING * 2,
      // TODO: Factor out with OnesCreatorPanel
      CountingCommonConstants.SINGLE_COUNTING_OBJECT_BOUNDS.height * NumberPlayConstants.GROUPED_STORED_COUNTING_OBJECT_SCALE + 5
    );

    // Properties to count the number of each type of symbol node
    const lessThanNodeCountProperty = new NumberProperty( 0 );
    const equalNodeCountProperty = new NumberProperty( 0 );
    const greaterThanNodeCountProperty = new NumberProperty( 0 );

    // create a map from SymbolType to countProperty
    const symbolToCountPropertyMap = new Map<SymbolType, TProperty<number>>();
    symbolToCountPropertyMap.set( '<', lessThanNodeCountProperty );
    symbolToCountPropertyMap.set( '=', equalNodeCountProperty );
    symbolToCountPropertyMap.set( '>', greaterThanNodeCountProperty );

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

    this.screenView = screenView;

    this.lessThanNodeCountProperty = lessThanNodeCountProperty;
    this.equalNodeCountProperty = equalNodeCountProperty;
    this.greaterThanNodeCountProperty = greaterThanNodeCountProperty;

    // make a creator node invisible if the max number for its type has been created
    this.lessThanNodeCountProperty.link( count => { lessThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.equalNodeCountProperty.link( count => { equalCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );
    this.greaterThanNodeCountProperty.link( count => { greaterThanCreatorNode.visible = count < MAX_SYMBOL_PIECE_COUNT; } );

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
  }

  public getAllSymbolNodes(): InequalitySymbolCardNode[] {
    const allSymbolNodes = _.filter( this.screenView.pieceLayer.children,
      child => child instanceof InequalitySymbolCardNode ) as InequalitySymbolCardNode[];
    return allSymbolNodes;
  }
}

numberPlay.register( 'InequalitySymbolCardCreatorPanel', InequalitySymbolCardCreatorPanel );
export default InequalitySymbolCardCreatorPanel;
