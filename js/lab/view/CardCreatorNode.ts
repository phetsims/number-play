// Copyright 2022, University of Colorado Boulder

/**
 * A node that looks like a CardNode that creates a CardNode when pressed.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { DragListener, Node, PressListenerEvent } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import InequalitySymbolCardNode, { SymbolType } from './InequalitySymbolCardNode.js';
import LabScreenView from './LabScreenView.js';
import Easing from '../../../../twixt/js/Easing.js';
import Animation from '../../../../twixt/js/Animation.js';
import CardNode from './CardNode.js';
import TProperty from '../../../../axon/js/TProperty.js';
import NumberCardNode from './NumberCardNode.js';

type SelfOptions = {
  symbolType?: SymbolType | null;
  number?: number | null;
};
export type CardNodeOptions = SelfOptions;

// TODO: add comments
class CardCreatorNode extends Node {

  public constructor( screenView: LabScreenView, contentToCountPropertyMap: Map<SymbolType | number, TProperty<number>>,
                      options: CardNodeOptions ) {
    super();

    let iconNode: Node;
    if ( options.symbolType ) {
      assert && assert( !options.number, 'symbolType and number cannot both be provided' );

      iconNode = new InequalitySymbolCardNode( {
        symbolType: options.symbolType,
        includeDragListener: false,
        dragBoundsProperty: screenView.objectPlayAreaBoundsProperty
      } );
    }
    else {
      assert && assert( options.number, 'symbolType or number must be provided' );

      iconNode = new NumberCardNode( {
        number: options.number!,
        includeDragListener: false,
        dragBoundsProperty: screenView.objectPlayAreaBoundsProperty
      } );
    }

    iconNode.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
      const dropListener = () => {
        const homeNodeBounds = options.symbolType ? screenView.bottomReturnZoneProperty.value : screenView.numberCardCreatorCarousel.bounds;

        if ( cardNode.bounds.intersectsBounds( homeNodeBounds ) ) {
          cardNode.inputEnabled = false;

          // calculate icon's origin
          let trail = screenView.getUniqueLeafTrailTo( iconNode );
          trail = trail.slice( 1, trail.length );
          const globalOrigin = trail.localToGlobalPoint( iconNode.localBounds.center );

          cardNode.animation = new Animation( {
            duration: 0.3,
            targets: [ {
              property: cardNode.positionProperty,
              easing: Easing.CUBIC_IN_OUT,
              to: globalOrigin
            } ]
          } );

          cardNode.animation.finishEmitter.addListener( () => {
            screenView.pieceLayer.removeChild( cardNode );
            cardNode.dispose();
            countProperty!.value--;
          } );
          cardNode.animation.start();
        }
      };

      let cardNode: CardNode;
      let countProperty: TProperty<number>;
      if ( options.symbolType ) {
        assert && assert( !options.number, 'symbolType and number cannot both be provided' );

        countProperty = contentToCountPropertyMap.get( options.symbolType )!;
        assert && assert( countProperty, 'countProperty for inequality symbol not found: ' + options.symbolType );

        cardNode = new InequalitySymbolCardNode( {
          symbolType: options.symbolType,
          dragBoundsProperty: screenView.objectPlayAreaBoundsProperty,
          dropListener: dropListener
        } );
      }
      else {
        assert && assert( options.number, 'symbolType or number must be provided' );

        countProperty = contentToCountPropertyMap.get( options.number! )!;

        cardNode = new NumberCardNode( {
          number: options.number!,
          dragBoundsProperty: screenView.numberCardBoundsProperty,
          dropListener: dropListener
        } );
      }

      countProperty.value++;

      screenView.pieceLayer.addChild( cardNode );
      cardNode.positionProperty.value = screenView.globalToLocalPoint( event.pointer.point ).minus( cardNode.localBounds.centerBottom.minusXY( 0, 15 ) );
      cardNode.dragListener!.press( event, cardNode );
    } ) );

    this.addChild( iconNode );
  }
}

numberPlay.register( 'CardCreatorNode', CardCreatorNode );
export default CardCreatorNode;