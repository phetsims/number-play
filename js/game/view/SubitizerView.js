// Copyright 2021, University of Colorado Boulder

import dotRandom from '../../../../dot/js/dotRandom.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Color from '../../../../scenery/js/util/Color.js';
import numberPlay from '../../numberPlay.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';

/**
 * SubitizerView displays the subitized objects in the view.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
class SubitizerView extends Node {

  /**
   * @param subitizerModel {SubitizerModel}
   * @param modelViewTransform {ModelViewTransform2}
   */
  constructor( subitizerModel, modelViewTransform ) {
    super();

    //TODO: placeholder for the object type generated
    const objectType = 'circle';

    // update the view shape when the model coordinates change
    subitizerModel.coordinatesProperty.link( coordinates => {
      this.removeAllChildren();
      const drawingNode = new Node();

      // create and add each object to the drawingNode
      coordinates.forEach( coordinate => {
        const object = objectType === 'circle' ? new Circle( 20, { fill: Color.BLACK } ) : "";
        object.centerX = modelViewTransform.modelToViewX( coordinate.x );
        object.centerY = modelViewTransform.modelToViewY( coordinate.y );
        drawingNode.addChild( object );
      } );

      // rotate the drawingNode randomly if a rotationProperty value exists
      if ( subitizerModel.rotationProperty.value && dotRandom.nextBoolean() ) {
        drawingNode.rotateAround( drawingNode.center, subitizerModel.rotationProperty.value );
      }

      this.addChild( drawingNode );
    } );
  }
}

numberPlay.register( 'SubitizerView', SubitizerView );
export default SubitizerView;