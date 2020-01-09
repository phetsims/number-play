// Copyright 2019, University of Colorado Boulder

/**
 *  A ten frame node that can be dragged around and hold play objects.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const DragListener = require( 'SCENERY/listeners/DragListener' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const TenFrameNode = require( 'NUMBER_PLAY/common/view/TenFrameNode' );
  const Vector2 = require( 'DOT/Vector2' );

  class DraggableTenFrameNode extends Node {

    /**
     * @param {number} sideLength - see doc below
     * @param {Vector2} initialPosition
     */
    constructor( tenFrame, modelViewTransform, dropListener ) {
      super();

      // @public {TenFrame}
      this.tenFrame = tenFrame;

      const tenFrameNode = TenFrameNode.getTenFramePath( {
        sideLength: tenFrame.squareSideLength
      } );
      tenFrameNode.center = new Vector2( 0, -tenFrameNode.height / 2 );
      this.addChild( tenFrameNode );

      // @public {DragListener}
      this.dragListener = new DragListener( {
        targetNode: this,
        transform: modelViewTransform,
        positionProperty: tenFrame.positionProperty,
        end: () => {
          dropListener();
        }
      } );

      this.cursor = 'pointer';
      // TODO: add a 'dragging' bar and make only that have a forwarding listener
      this.inputListeners = [ DragListener.createForwardingListener( event => {
        this.dragListener.press( event, this );
        this.moveToFront();
      } ) ];

      tenFrame.positionProperty.link( position => {
        this.translation = modelViewTransform.modelToViewPosition( position );
      } );
    }
  }

  return numberPlay.register( 'DraggableTenFrameNode', DraggableTenFrameNode );
} );