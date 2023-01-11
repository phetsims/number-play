// Copyright 2021-2023, University of Colorado Boulder

/**
 * SubitizerRevealButton re-reveals the subitizer shape when pressed.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Color, Path } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import eyeSolidShape from '../../../../sherpa/js/fontawesome-5/eyeSolidShape.js';
import NumberPlayColors from '../../common/NumberPlayColors.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import TProperty from '../../../../axon/js/TProperty.js';

// constants
const BUTTON_SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2;
const BUTTON_CONTENT_MARGIN = 6;
const BUTTON_TOUCH_AREA_DILATION = 10;

class SubitizeRevealButton extends RectangularPushButton {

  public constructor( isChallengeSolvedProperty: TReadOnlyProperty<boolean>, subitizerIsInputEnabledProperty: TReadOnlyProperty<boolean>,
                      isShapeVisibleProperty: TProperty<boolean> ) {

    const eyeNode = new Path( eyeSolidShape, {
      fill: Color.BLACK
    } );

    // The reveal button is visible only when a challenge is unsolved, when the subitizer is accepting input, and
    // when the subitizer shape is not visible.
    const revealButtonVisibleProperty = new DerivedProperty(
      [ isChallengeSolvedProperty, subitizerIsInputEnabledProperty, isShapeVisibleProperty ],
      ( isChallengeSolved, subitizerIsInputEnabled, isShapeVisible ) => {
        return !isChallengeSolved && subitizerIsInputEnabled && !isShapeVisible;
      } );

    super( {
      content: eyeNode,
      xMargin: BUTTON_CONTENT_MARGIN,
      yMargin: BUTTON_CONTENT_MARGIN,
      touchAreaXDilation: BUTTON_TOUCH_AREA_DILATION,
      touchAreaYDilation: BUTTON_TOUCH_AREA_DILATION,
      size: new Dimension2( BUTTON_SIDE_LENGTH, BUTTON_SIDE_LENGTH ),
      baseColor: NumberPlayColors.subitizeGameLightColorProperty,
      visibleProperty: revealButtonVisibleProperty,
      listener: () => {
        isShapeVisibleProperty.value = true;
      }
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

numberPlay.register( 'SubitizeRevealButton', SubitizeRevealButton );
export default SubitizeRevealButton;