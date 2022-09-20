// Copyright 2022, University of Colorado Boulder

/**
 * A card with an inequality symbol on it that can be dragged.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import TProperty from '../../../../axon/js/TProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
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
  dragBoundsProperty: TReadOnlyProperty<Bounds2>;
  includeDragListener?: boolean;
  dropListener?: () => void;
};
export type InequalitySymbolNodeOptions = SelfOptions;

class InequalitySymbolNode extends Node {
  public readonly dragListener: DragListener | null;
  public readonly positionProperty: TProperty<Vector2>;
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
      font: new PhetFont( 46 )
    } );
    inequalitySymbol.center = backgroundShape.center;
    backgroundShape.addChild( inequalitySymbol );

    this.cursor = 'pointer';

    if ( options.includeDragListener ) {
      this.dragListener = new DragListener( {
        targetNode: this,
        drag: ( event: PressListenerEvent, listener: DragListener ) => {
          this.setConstrainedDestination( options.dragBoundsProperty.value, listener.parentPoint );
        },
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

  /**
   * Determine how this symbol's origin can be placed in the provided bounds.
   */
  public getOriginBounds( viewBounds: Bounds2 ): Bounds2 {
    return new Bounds2(
      viewBounds.left - this.localBounds.left,
      viewBounds.top - this.localBounds.top,
      viewBounds.right - this.localBounds.right,
      viewBounds.bottom - this.localBounds.bottom
    ).eroded( CountingCommonConstants.COUNTING_PLAY_AREA_MARGIN );
  }

  /**
   * If this symbol's outside the available view bounds, move in inside those bounds.
   */
  public setConstrainedDestination( viewBounds: Bounds2, newDestination: Vector2 ): void {
    const originBounds = this.getOriginBounds( viewBounds );
    this.positionProperty.value = originBounds.closestPointTo( newDestination );
  }
}

numberPlay.register( 'InequalitySymbolNode', InequalitySymbolNode );
export default InequalitySymbolNode;