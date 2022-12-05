// Copyright 2022, University of Colorado Boulder

/**
 * A button that shows a warning dialog when pressed.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../dot/js/Dimension2.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import { Color, Path } from '../../../../scenery/js/imports.js';
import exclamationTriangleSolidShape from '../../../../sherpa/js/fontawesome-5/exclamationTriangleSolidShape.js';
import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import numberPlay from '../../numberPlay.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Multilink from '../../../../axon/js/Multilink.js';
import MissingVoiceWarningDialog from './MissingVoiceWarningDialog.js';

// constants
// TODO: Factor out with other buttons
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class MissingVoiceWarningButton extends RectangularPushButton {

  public constructor( isPrimaryLocaleProperty: TReadOnlyProperty<boolean>,
                      primaryLocaleVoiceEnabledProperty: TReadOnlyProperty<boolean>,
                      secondaryLocaleVoiceEnabledProperty: TReadOnlyProperty<boolean>
  ) {

    const warningDialog = new MissingVoiceWarningDialog();

    super( {
      content: new Path( exclamationTriangleSolidShape, {
        fill: new Color( 240, 79, 79 )
      } ),
      size: new Dimension2( SIDE_LENGTH, SIDE_LENGTH ),
      baseColor: Color.WHITE,
      listener: () => warningDialog.show()
    } );

    Multilink.multilink( [ isPrimaryLocaleProperty, primaryLocaleVoiceEnabledProperty, secondaryLocaleVoiceEnabledProperty ],
      ( isPrimaryLocale, primaryLocaleVoiceEnabled, secondaryLocaleVoiceEnabled ) => {
        this.visible = isPrimaryLocale ? !primaryLocaleVoiceEnabled : !secondaryLocaleVoiceEnabled;
      } );
  }
}

numberPlay.register( 'MissingVoiceWarningButton', MissingVoiceWarningButton );
export default MissingVoiceWarningButton;