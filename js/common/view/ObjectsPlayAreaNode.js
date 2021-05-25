// Copyright 2019-2021, University of Colorado Boulder

/**
 * TODO
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import merge from '../../../../phet-core/js/merge.js';
import BucketFront from '../../../../scenery-phet/js/bucket/BucketFront.js';
import BucketHole from '../../../../scenery-phet/js/bucket/BucketHole.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import numberPlay from '../../numberPlay.js';
import PlayObjectNode from './PlayObjectNode.js';
import PlayObjectGroupNode from './PlayObjectGroupNode.js';

class ObjectsPlayAreaNode extends Node {

  /**
   * @param {ObjectsPlayArea} playArea
   * @param {Bounds2} playAreaBounds
   * @param {ModelViewTransform2} translateMVT
   */
  constructor( playArea, playAreaBounds, translateMVT, options ) {
    super();

    options = merge( {
      playObjectsLayer: null // {null|Node}
    }, options );

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

    const playObjectGroupsLayer = new Node();
    this.addChild( playObjectGroupsLayer );

    // create and add a layer for all play objects in the play area, if not provided in options
    let playObjectsLayer = null;
    if ( options.playObjectsLayer ) {
      playObjectsLayer = options.playObjectsLayer;
    }
    else {
      playObjectsLayer = new Node();
      this.addChild( playObjectsLayer );
    }

    // create and add the play object nodes
    playArea.playObjects.forEach( playObject => {
      const playObjectNode = new PlayObjectNode( playObject, playAreaBounds, playArea.checkPlayObjectForGroups, translateMVT );
      playObjectsStorageLayer.addChild( playObjectNode );

      // add the playObject to the play area or bucket when dropped by the user
      playObject.userControlledProperty.lazyLink( userControlled => {
        if ( !userControlled ) {
          if ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
               bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) {
            if ( playObjectsLayer.hasChild( playObjectNode ) ) {
              playObjectsLayer.removeChild( playObjectNode );
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
            if ( playObject.playObjectGroup ) {
              playObject.sendToGroupSpot();
            }
            else {
              playArea.checkIfCoveringPlayObject( playObject, 0 );
            }
          }
        }
        // else it is user controlled
        else {
          // if the playObjectNode is in the storage layer, move it to the play layer
          if ( playObjectsStorageLayer.hasChild( playObjectNode ) ) {
            playObjectsStorageLayer.removeChild( playObjectNode );
            playObjectsLayer.addChild( playObjectNode );
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

      // put away playObjectNodes when they are not being controlled and touching the bucket, and not part of a group
      playObject.positionProperty.link( () => {
        if ( ( bucketFrontNode.bounds.intersectsBounds( playObjectNode.bounds ) ||
               bucketHole.bounds.intersectsBounds( playObjectNode.bounds ) ) &&
             !playObject.userControlledProperty.value && !playObject.playObjectGroup ) {
          if ( playObjectsLayer.hasChild( playObjectNode ) ) {
            playObjectsLayer.removeChild( playObjectNode );
            playObjectsStorageLayer.addChild( playObjectNode );
          }
        }
      } );
    } );

    // add or remove PlayObjectGroupNodes when PlayObjectGroups change
    const playObjectGroupAddedListener = playObjectGroup => {
      const playObjectGroupNode = new PlayObjectGroupNode( playObjectGroup, playAreaBounds, translateMVT );
      playObjectGroupsLayer.addChild( playObjectGroupNode );
    };
    const playObjectGroupRemovedListener = playObjectGroup => {
      const playObjectGroupNode = _.find( playObjectGroupsLayer.children,
          playObjectGroupNode => playObjectGroupNode.playObjectGroup === playObjectGroup );
      playObjectGroupNode && playObjectGroupsLayer.removeChild( playObjectGroupNode );
    };

    playArea.playObjectGroups.addItemAddedListener( playObjectGroupAddedListener );
    playArea.playObjectGroups.addItemRemovedListener( playObjectGroupRemovedListener );
  }

}

numberPlay.register( 'ObjectsPlayAreaNode', ObjectsPlayAreaNode );
export default ObjectsPlayAreaNode;