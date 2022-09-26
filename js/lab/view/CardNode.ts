// Copyright 2022, University of Colorado Boulder

/**
 * A card with content that can be dragged.
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
import { Color, DragListener, Node, PressListenerEvent, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';

// constants
const WIDTH = 50;
const CORNER_RADIUS = 10;

type SelfOptions = {
  height: number;
  width: number;
  dragBoundsProperty: TReadOnlyProperty<Bounds2>;
  includeDragListener?: boolean;
  dropListener?: () => void;
};
export type CardNodeOptions = SelfOptions;

class CardNode extends Node {
  public readonly dragListener: DragListener | null;
  public readonly positionProperty: TProperty<Vector2>;
  public static readonly WIDTH = WIDTH;

  public constructor( content: Node, providedOptions: CardNodeOptions ) {
    super();

    const options = optionize<CardNodeOptions, SelfOptions>()( {
      includeDragListener: true,
      dropListener: _.noop
    }, providedOptions );

    this.positionProperty = new Vector2Property( Vector2.ZERO );

    const halfWidth = options.width / 2;
    const halfHeight = options.height / 2;
    const backgroundShape = new Rectangle( {
      rectBounds: new Bounds2( -halfWidth, -halfHeight, halfWidth, halfHeight ),
      cornerRadius: CORNER_RADIUS,
      stroke: Color.BLACK,
      fill: Color.WHITE,
      lineWidth: 1
    } );
    this.addChild( backgroundShape );

    content.center = backgroundShape.center;
    backgroundShape.addChild( content );

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

numberPlay.register( 'CardNode', CardNode );
export default CardNode;