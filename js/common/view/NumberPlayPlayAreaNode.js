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

  class NumberPlayPlayAreaNode extends Node {

    /**
     * @param {NumberPlayPlayArea} playArea
     * @param {NumberProperty} currentNumberProperty
     * @param {Bounds2} playAreaBounds
     * @param {ModelViewTransform2} translateMVT
     */
    constructor( playArea, currentNumberProperty, playAreaBounds, translateMVT ) {
      super();

      // create and add the bucket back
      const bucketHole = new BucketHole( playArea.bucket, translateMVT );
      this.addChild( bucketHole );

      // create and add a layer for all play objects
      const playObjectsLayer = new Node();
      this.addChild( playObjectsLayer );

      // create and add the bucket front
      const bucketFrontNode = new BucketFront( playArea.bucket, translateMVT );
      bucketFrontNode.centerBottom = translateMVT.modelToViewPosition( playArea.bucket.position );
      bucketHole.center = bucketFrontNode.centerTop;
      this.addChild( bucketFrontNode );

      // create and add the play object nodes
      playArea.playObjects.forEach( playObject => {
        const playObjectNode = new PlayObjectNode( playObject, playAreaBounds, translateMVT );
        playObjectsLayer.addChild( playObjectNode );

        playObject.userControlledProperty.lazyLink( userControlled => {
          if ( !userControlled ) {
            if ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
                 bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) {
              playArea.returnPlayObjectToBucket( playObject );
            }
            else {
              playArea.addPlayObjectToPlayArea( playObject );
            }
          }
        } );
      } );
    }

  }

  return numberPlay.register( 'NumberPlayPlayAreaNode', NumberPlayPlayAreaNode );
} );