// Copyright 2022, University of Colorado Boulder

/**
 * Message dialog displayed when the MissingVoiceWarningButton is pressed.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import OopsDialog from '../../../../scenery-phet/js/OopsDialog.js';
import PhetFont from '../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, Path } from '../../../../scenery/js/imports.js';
import exclamationTriangleSolidShape from '../../../../sherpa/js/fontawesome-5/exclamationTriangleSolidShape.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';

class MissingVoiceWarningDialog extends OopsDialog {

  public constructor() {

    const messageProperty = new DerivedProperty( [ NumberPlayStrings.noDeviceFoundDescriptionStringProperty,
        NumberPlayStrings.yourDeviceMaySupportDescriptionStringProperty ],
      ( noDeviceFoundDescriptionString, yourDeviceMaySupportDescription ) => {
      return `<br>${noDeviceFoundDescriptionString}<br><br>${yourDeviceMaySupportDescription}`;
      } );

    super( messageProperty, {
      richTextOptions: {
        font: new PhetFont( 18 )
      },
      title: new Path( exclamationTriangleSolidShape, {
        fill: new Color( 240, 79, 79 ),
        maxWidth: 35
      } ),
      iconNode: new Node()
    } );
  }
}

numberPlay.register( 'MissingVoiceWarningDialog', MissingVoiceWarningDialog );
export default MissingVoiceWarningDialog;