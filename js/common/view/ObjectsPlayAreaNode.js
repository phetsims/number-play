// Copyright 2019, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const BucketFront = require( 'SCENERY_PHET/bucket/BucketFront' );
  const BucketHole = require( 'SCENERY_PHET/bucket/BucketHole' );
  const Node = require( 'SCENERY/nodes/Node' );
  const numberPlay = require( 'NUMBER_PLAY/numberPlay' );
  const PlayObjectNode = require( 'NUMBER_PLAY/common/view/PlayObjectNode' );

  class ObjectsPlayAreaNode extends Node {

    /**
     * @param {NumberPlayPlayArea} playArea
     * @param {Bounds2} playAreaBounds
     * @param {ModelViewTransform2} translateMVT
     */
    constructor( playArea, playAreaBounds, translateMVT ) {
      super();

      // create and add the bucket back
      const bucketHole = new BucketHole( playArea.bucket, translateMVT );
      this.addChild( bucketHole );

      // create and add a layer for all play objects in the bucket
      const playObjectsStorageLayer = new Node();
      this.addChild( playObjectsStorageLayer );

      // create and add the bucket front
      const bucketFrontNode = new BucketFront( playArea.bucket, translateMVT );
      bucketFrontNode.centerBottom = translateMVT.modelToViewPosition( playArea.bucket.position );
      bucketHole.center = bucketFrontNode.centerTop;
      this.addChild( bucketFrontNode );

      // create and add a layer for all play objects in the play area
      const playObjectsPlayAreaLayer = new Node();
      this.addChild( playObjectsPlayAreaLayer );

      // create and add the play object nodes
      playArea.playObjects.forEach( playObject => {
        const playObjectNode = new PlayObjectNode( playObject, playAreaBounds, translateMVT );
        playObjectsStorageLayer.addChild( playObjectNode );

        // add the playObject to the play area or bucket when dropped by the user
        playObject.userControlledProperty.lazyLink( userControlled => {
          if ( !userControlled ) {
            if ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
                 bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) {
              if ( playObjectsPlayAreaLayer.hasChild( playObjectNode ) ) {
                playObjectsPlayAreaLayer.removeChild( playObjectNode );
                playObjectsStorageLayer.addChild( playObjectNode );
              }
              playArea.returnPlayObjectToBucket( playObject );

              // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
              if ( playArea.currentNumberProperty.value > playArea.currentNumberProperty.range.min ) {
                playArea.isControllingCurrentNumber = true;
                playArea.currentNumberProperty.value--;
                playArea.isControllingCurrentNumber = false;
              }
            }
            else {
              playArea.checkIfCoveringPlayObject( playObject, 0 );
            }
          }
          else {
            if ( playObjectsStorageLayer.hasChild( playObjectNode ) ) {
              playObjectsStorageLayer.removeChild( playObjectNode );
              playObjectsPlayAreaLayer.addChild( playObjectNode );
            }
            if ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
                 bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) {
              playArea.addPlayObjectToPlayArea( playObject );

              // TODO: the need for this guard means that the play areas are not in sync, and should be eliminated when https://github.com/phetsims/number-play/issues/6 is fixed.
              if ( playArea.currentNumberProperty.value < playArea.currentNumberProperty.range.max ) {
                playArea.isControllingCurrentNumber = true;
                playArea.currentNumberProperty.value++;
                playArea.isControllingCurrentNumber = false;
              }
            }
          }
        } );

        playObject.positionProperty.link( () => {
          if ( ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
                 bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) && !playObject.userControlledProperty.value ) {
            if ( playObjectsPlayAreaLayer.hasChild( playObjectNode ) ) {
              playObjectsPlayAreaLayer.removeChild( playObjectNode );
              playObjectsStorageLayer.addChild( playObjectNode );
            }
          }
        } );
      } );
    }

  }

  return numberPlay.register( 'ObjectsPlayAreaNode', ObjectsPlayAreaNode );
} );