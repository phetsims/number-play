// Copyright 2021, University of Colorado Boulder

/**
 * SubitizerNode displays the subitized objects in the view.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Circle, Color, Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import Subitizer from '../model/Subitizer.js';

// constants
const CORNER_RADIUS = 10; // empirically determined, in screen coordinates

class SubitizerNode extends Node {

  constructor( subitizer: Subitizer ) {
    super();

    // for scaling the objects
    const scaleMVT = ModelViewTransform2.createOffsetScaleMapping( Vector2.ZERO, 90 ); // empirically determined

    // create and add the background node
    const backgroundNode = new Rectangle( 0, 0, scaleMVT.modelToViewDeltaX( Subitizer.SUBITIZER_BOUNDS.width ),
      scaleMVT.modelToViewDeltaY( Subitizer.SUBITIZER_BOUNDS.height ), CORNER_RADIUS, CORNER_RADIUS, {
        fill: Color.WHITE,
        stroke: Color.BLACK,
        lineWidth: 2
      } );
    backgroundNode.center = Vector2.ZERO;
    this.addChild( backgroundNode );

    // create and add the drawing node, which is where the objects are added to
    const drawingNode = new Node( {
      visibleProperty: subitizer.visibleProperty
    } );
    this.addChild( drawingNode );

    // update the view shape when the model coordinates change
    subitizer.coordinatesProperty.link( coordinates => {
      drawingNode.removeAllChildren();

      // create and add each object to the drawing node
      coordinates.forEach( coordinate => {
        let object;
        if ( subitizer.objectTypeProperty.value === 'circle' ) {
          object = new Circle( scaleMVT.modelToViewDeltaX( subitizer.objectSize * 0.5 ), { fill: Color.BLACK } );
        }
        else {
          // @ts-ignore TODO-TS: Update PLAY_OBJECT_TYPE_TO_IMAGE when PlayObjectType is converted to a supported enumeration pattern.
          object = new Image( CountingCommonConstants.PLAY_OBJECT_TYPE_TO_IMAGE[ _.toUpper( subitizer.objectTypeProperty.value ) ], {
            maxHeight: scaleMVT.modelToViewDeltaX( subitizer.objectSize )
          } );
        }
        object.centerX = scaleMVT.modelToViewX( coordinate.x );
        object.centerY = scaleMVT.modelToViewY( coordinate.y );
        drawingNode.addChild( object );
      } );
    } );
  }
}

numberPlay.register( 'SubitizerNode', SubitizerNode );
export default SubitizerNode;