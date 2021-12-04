// Copyright 2021, University of Colorado Boulder

/**
 * SubitizerRevealButton re-reveals the subitizer shape when pressed.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Color, Path } from '../../../../scenery/js/imports.js';
import numberPlay from '../../numberPlay.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import ResetShape from '../../../../scenery-phet/js/ResetShape.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import NumberPlayConstants from '../../common/NumberPlayConstants.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

// constants
const RESET_SHAPE_RADIUS = 16; // empirically determined
const BUTTON_SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2;
const BUTTON_CONTENT_MARGIN = 6; // empirically determined

class SubitizeRevealButton extends RectangularPushButton {

  constructor( isChallengeSolvedProperty: BooleanProperty, subitizerInputEnabledProperty: BooleanProperty,
               subitizerVisibleProperty: BooleanProperty ) {

    const resetIcon = new Path( new ResetShape( RESET_SHAPE_RADIUS ), {
      fill: Color.BLACK
    } );

    // The show again button is visible only when a challenge is unsolved, when the subitizer is accepting input, and
    // when the subitizer shape is not visible.
    const visibleProperty = new DerivedProperty(
      [ isChallengeSolvedProperty, subitizerInputEnabledProperty, subitizerVisibleProperty ],
      ( isChallengeSolved, subitizerInputEnabled, subitizerVisible ) => {
        return !isChallengeSolved && subitizerInputEnabled && !subitizerVisible;
      } );

    super( {
      content: resetIcon,
      xMargin: BUTTON_CONTENT_MARGIN,
      yMargin: BUTTON_CONTENT_MARGIN,
      size: new Dimension2( BUTTON_SIDE_LENGTH, BUTTON_SIDE_LENGTH ),
      baseColor: NumberPlayConstants.SUBITIZE_GAME_COLOR_LIGHT,
      visibleProperty: visibleProperty,
      listener: () => {
        subitizerVisibleProperty.value = true;
      }
    } );
  }
}

numberPlay.register( 'SubitizeRevealButton', SubitizeRevealButton );
export default SubitizeRevealButton;