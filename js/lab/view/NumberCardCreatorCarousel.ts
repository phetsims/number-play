// Copyright 2022, University of Colorado Boulder

/**
 * The top carousel with number pieces for the Lab screen.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Node } from '../../../../scenery/js/imports.js';
import Carousel from '../../../../sun/js/Carousel.js';
import numberPlay from '../../numberPlay.js';
import LabScreenView from './LabScreenView.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import CardCreatorNode from './CardCreatorNode.js';
import NumberCardNode from './NumberCardNode.js';
import Property from '../../../../axon/js/Property.js';

// constants
const MAX_NUMBER_PIECE_COUNT = 20;

class NumberCardCreatorCarousel extends Carousel {
  private readonly screenView: LabScreenView;
  private readonly clearNumberCardsNodes: () => void;
  private readonly numberToCountPropertyMap: Map<number, Property<number>>;

  public constructor( screenView: LabScreenView ) {

    // create a map from SymbolType to countProperty
    const numberToCountPropertyMap = new Map<number, Property<number>>();

    const numberCardCreatorNodes: Node[] = [];

    // Number stacks
    _.range( 1, 21 ).forEach( number => {

      // make a creator node for each number
      const numberCardCreatorNode = new CardCreatorNode( screenView, numberToCountPropertyMap, {
        number: number
      } );
      numberCardCreatorNodes.push( numberCardCreatorNode );

      const numberProperty = new NumberProperty( 0 );
      numberToCountPropertyMap.set( number, numberProperty );

      numberProperty.link( count => { numberCardCreatorNode.visible = count < MAX_NUMBER_PIECE_COUNT; } );
    } );

    super( numberCardCreatorNodes.map( numberCardCreatorNode => {
      return new Node().addChild( numberCardCreatorNode );
    } ), {
      itemsPerPage: 10,
      margin: 14,
      spacing: 8,
      animationDuration: 0.4
    } );

    this.screenView = screenView;
    this.numberToCountPropertyMap = numberToCountPropertyMap;

    // removes and disposes all types of symbol nodes
    this.clearNumberCardsNodes = () => {
      const allNumberCardNodes = this.getAllNumberCardNodes();
      allNumberCardNodes.forEach( numberCardNode => {
        screenView.pieceLayer.removeChild( numberCardNode );
        numberCardNode.dispose();
      } );
    };
  }

  public override reset(): void {
    super.reset();
    this.clearNumberCardsNodes();
    this.numberToCountPropertyMap.forEach( countProperty => {
      countProperty.reset();
    } );
  }

  public getAllNumberCardNodes(): NumberCardNode[] {
    const allNumberCardNodes = _.filter( this.screenView.pieceLayer.children,
      child => child instanceof NumberCardNode ) as NumberCardNode[];
    return allNumberCardNodes;
  }
}

numberPlay.register( 'NumberCardCreatorCarousel', NumberCardCreatorCarousel );
export default NumberCardCreatorCarousel;
