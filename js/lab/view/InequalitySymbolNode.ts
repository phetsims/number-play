// Copyright 2022, University of Colorado Boulder

/**
 * A card with an inequality symbol on it that can be dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import IProperty from '../../../../axon/js/IProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, DragListener, Node, PressListenerEvent, Rectangle, Text } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';

// constants
const SIDE_LENGTH = 50;
const CORNER_RADIUS = 10;

// TODO: This should be in its own file, not exported as a type here.
export type SymbolType = '<' | '=' | '>';
type SelfOptions = {
  symbolType: SymbolType;
  includeDragListener?: boolean;
  dropListener?: () => void;
};
export type InequalitySymbolNodeOptions = SelfOptions;

class InequalitySymbolNode extends Node {
  public readonly dragListener: DragListener | null;
  public readonly positionProperty: IProperty<Vector2>;
  public static readonly SIDE_LENGTH = SIDE_LENGTH;

  public constructor( providedOptions: InequalitySymbolNodeOptions ) {
    super();

    const options = optionize<InequalitySymbolNodeOptions, SelfOptions>()( {
      includeDragListener: true,
      dropListener: _.noop
    }, providedOptions );

    this.positionProperty = new Vector2Property( Vector2.ZERO );

    const halfSideLength = SIDE_LENGTH / 2;
    const backgroundShape = new Rectangle( {
      rectBounds: new Bounds2( -halfSideLength, -halfSideLength, halfSideLength, halfSideLength ),
      cornerRadius: CORNER_RADIUS,
      stroke: Color.BLACK,
      fill: Color.WHITE,
      lineWidth: 1
    } );
    this.addChild( backgroundShape );

    const inequalitySymbol = new Text( options.symbolType, {
      font: new PhetFont( 40 )
    } );
    inequalitySymbol.center = backgroundShape.center;
    backgroundShape.addChild( inequalitySymbol );

    this.cursor = 'pointer';

    if ( options.includeDragListener ) {
      this.dragListener = new DragListener( {
        targetNode: this,
        positionProperty: this.positionProperty,
        end: () => {
          options.dropListener();
        }
      } );

      this.addInputListener( DragListener.createForwardingListener( ( event: PressListenerEvent ) => {
        this.dragListener!.press( event, this );
        this.moveToFront();
      } ) );
    }
    else {
      this.dragListener = null;
    }

    this.positionProperty.link( position => {
      this.translation = position;
    } );
  }
}

numberPlay.register( 'InequalitySymbolNode', InequalitySymbolNode );
export default InequalitySymbolNode;