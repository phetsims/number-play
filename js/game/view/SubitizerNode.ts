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
import { Circle, Color, Image, Node, Path, Rectangle } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import Subitizer from '../model/Subitizer.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import PlayIconShape from '../../../../scenery-phet/js/PlayIconShape.js';
import SubitizeLoadingBarNode from './SubitizeLoadingBarNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import SubitizeRevealButton from './SubitizeRevealButton.js';

// constants
const CORNER_RADIUS = 10; // empirically determined, in screen coordinates
const REVEAL_BUTTON_MARGIN = 12; // empirically determined, in screen coordinates

class SubitizerNode extends Node {

  constructor( subitizer: Subitizer, isChallengeSolvedProperty: BooleanProperty, newChallenge: () => void ) {
    super();

    // for scaling the objects
    const scaleMVT = ModelViewTransform2.createOffsetScaleMapping( Vector2.ZERO, 105 ); // empirically determined

    // create and add the background node
    const backgroundNode = new Rectangle( 0, 0, scaleMVT.modelToViewDeltaX( Subitizer.SUBITIZER_BOUNDS.width ),
      scaleMVT.modelToViewDeltaY( Subitizer.SUBITIZER_BOUNDS.height ), CORNER_RADIUS, CORNER_RADIUS, {
        fill: Color.WHITE,
        stroke: Color.BLACK,
        lineWidth: 2
      } );
    backgroundNode.center = Vector2.ZERO;
    this.addChild( backgroundNode );

    // create and add the loading bar node
    const subitizeLoadingBarNode = new SubitizeLoadingBarNode( newChallenge, subitizer.loadingBarAnimatingProperty );
    subitizeLoadingBarNode.center = this.center;
    this.addChild( subitizeLoadingBarNode );

    // create and add the play button
    const playButton = new RectangularPushButton( {
      baseColor: Color.YELLOW,
      content: new Path( new PlayIconShape( 36, 45 ), {
        fill: Color.BLACK,
        centerX: 1.4,
        centerY: 0
      } ),
      xMargin: 25,
      yMargin: 19,
      visibleProperty: subitizer.playButtonVisibleProperty,
      listener: () => {
        playButton.visibleProperty.value = false;
        subitizeLoadingBarNode.start();
      }
    } );
    playButton.center = this.center;
    this.addChild( playButton );

    // create and add the reveal button
    const revealButton = new SubitizeRevealButton(
      isChallengeSolvedProperty,
      subitizer.inputEnabledProperty,
      subitizer.shapeVisibleProperty
    );
    revealButton.right = this.right - REVEAL_BUTTON_MARGIN;
    revealButton.bottom = this.bottom - REVEAL_BUTTON_MARGIN;
    this.addChild( revealButton );

    // cancel the animation and hide the loading bar node if loadingBarAnimatingProperty is set to false
    subitizer.loadingBarAnimatingProperty.link( loadingBarAnimating => {
      if ( !loadingBarAnimating ) {
        subitizeLoadingBarNode.reset();
      }
    } );

    // create and add the drawing node, which is where the objects are added to
    const drawingNode = new Node( {
      visibleProperty: subitizer.shapeVisibleProperty
    } );
    this.addChild( drawingNode );

    // update the view shape when the model points change
    subitizer.pointsProperty.link( points => {
      drawingNode.removeAllChildren();

      // create and add each object to the drawing node
      points.forEach( point => {
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
        object.centerX = scaleMVT.modelToViewX( point.x );
        object.centerY = scaleMVT.modelToViewY( point.y );
        drawingNode.addChild( object );
      } );
    } );
  }
}

numberPlay.register( 'SubitizerNode', SubitizerNode );
export default SubitizerNode;