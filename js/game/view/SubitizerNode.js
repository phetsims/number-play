// Copyright 2021, University of Colorado Boulder

import CountingCommonConstants from '../../../../counting-common/js/common/CountingCommonConstants.js';
import PlayObjectType from '../../../../counting-common/js/common/model/PlayObjectType.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import Color from '../../../../scenery/js/util/Color.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import Animation from '../../../../twixt/js/Animation.js';
import Easing from '../../../../twixt/js/Easing.js';
import numberPlay from '../../numberPlay.js';
import Circle from '../../../../scenery/js/nodes/Circle.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Text from '../../../../scenery/js/nodes/Text.js';

// constants
const WIDTH = 425; // empirically determined, in screen coordinates
const HEIGHT = 275; // empirically determined, in screen coordinates
const CORNER_RADIUS = 10; // empirically determined, in screen coordinates

/**
 * SubitizerNode displays the subitized objects in the view.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */
class SubitizerNode extends Node {

  /**
   * @param subitizerModel {SubitizerModel}
   */
  constructor( subitizerModel ) {
    super();

    // @private, for use in setTextObjectVisibility
    this.subitizerModel = subitizerModel;

    // create and add a backgroundNode
    const backgroundNode = new Rectangle( 0, 0, WIDTH, HEIGHT, CORNER_RADIUS, CORNER_RADIUS, {
      fill: 'white'
    } );
    backgroundNode.center = Vector2.ZERO;
    this.addChild( backgroundNode );

    // listener to start the start sequence when the play button is clicked
    const playButtonListener = () => {
      playButton.visibleProperty.value = false;
      this.setTextObjectVisibility( [ 3, 2, 1, 'GO' ], backgroundNode.center );
    };

    // create and add playButton
    const playButton = new RectangularPushButton( {
      baseColor: Color.YELLOW,
      content: new Path( new PlayIconShape( 36, 45 ), {
        fill: 'black',
        centerX: 1.4,
        centerY: 0
      } ),
      xMargin: 25,
      yMargin: 19,
      visibleProperty: subitizerModel.playButtonVisibleProperty,
      listener: playButtonListener
    } );
    playButton.center = backgroundNode.center;
    this.addChild( playButton );

    // for scaling the objects
    const scaleMVT = ModelViewTransform2.createOffsetScaleMapping( Vector2.ZERO, 90 );

    // create and add the drawingNode, which is where the objects are added to and it rotates if rotationProperty is set
    const drawingNode = new Node( {
      visibleProperty: subitizerModel.visibleProperty
    } );
    this.addChild( drawingNode );

    // update the view shape when the model coordinates change
    subitizerModel.coordinatesProperty.link( coordinates => {
      drawingNode.removeAllChildren();

      // create array of objects available and choose a random object from that array
      const objectTypes = [ 'CIRCLE' ];
      PlayObjectType.VALUES.forEach( playObjectType => objectTypes.push( playObjectType ) );
      const randomObject = dotRandom.sample( objectTypes );

      // create and add each object to the drawingNode
      coordinates.forEach( coordinate => {
        let object;
        if ( randomObject === 'CIRCLE' ) {
          object = new Circle( scaleMVT.modelToViewDeltaX( subitizerModel.objectWidth * 0.5 ), { fill: Color.BLACK } );
        }
        else {
          object = new Image( CountingCommonConstants.PLAY_OBJECT_TYPE_TO_IMAGE[ randomObject ], {
            maxHeight: scaleMVT.modelToViewDeltaX( subitizerModel.objectWidth )
          } );
        }
        object.centerX = scaleMVT.modelToViewX( coordinate.x );
        object.centerY = scaleMVT.modelToViewY( coordinate.y );
        drawingNode.addChild( object );
      } );
    } );
  }

  /**
   * Animates an object in the start sequence to fade out
   * @param {Array} startSequenceText - array of the text that will make the start sequence
   * @param {Vector2} centerPosition
   * @private
   */
  setTextObjectVisibility( startSequenceText, centerPosition ) {

    // create and add textObject
    const textObject = new Text( startSequenceText[ 0 ], {
      font: new PhetFont( 55 )
    } );
    textObject.center = centerPosition;
    this.addChild( textObject );
    textObject.visible = true;

    // Animate opacity of textObject, fade it out.
    textObject.opacityProperty.value = 1;
    let textObjectAnimation = new Animation( {
      delay: 0.5,
      duration: 0.5,
      targets: [ {
        property: textObject.opacityProperty,
        easing: Easing.LINEAR,
        to: 0
      } ]
    } );

    textObjectAnimation.finishEmitter.addListener( () => {
      textObject.visible = false;
      textObjectAnimation = null;
      startSequenceText.shift();
      // animate the remaining objects in the start sequence if there are any remaining or start the game
      if ( startSequenceText.length > 0 ) {
        this.setTextObjectVisibility( startSequenceText, textObject.center );
      }
      else {
        this.subitizerModel.isPlayingProperty.value = true;
        this.subitizerModel.visibleProperty.value = true;
      }
    } );

    textObjectAnimation.start();
  }
}

numberPlay.register( 'SubitizerNode', SubitizerNode );
export default SubitizerNode;