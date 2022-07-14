// Copyright 2022, University of Colorado Boulder

/**
 * A square button that has a 'ten frame' representation on it.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import RectangularPushButton from '../../../../sun/js/buttons/RectangularPushButton.js';
import numberPlay from '../../numberPlay.js';
import TenFrameNode from './TenFrameNode.js';
import SceneryPhetConstants from '../../../../scenery-phet/js/SceneryPhetConstants.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import { IColor } from '../../../../scenery/js/imports.js';

// constants
const SIDE_LENGTH = SceneryPhetConstants.DEFAULT_BUTTON_RADIUS * 2; // match the size of the ResetAllButton, in screen coords

class OrganizeButton extends RectangularPushButton {

  public constructor( color: IColor, listener: () => void ) {

    const tenFramePath = TenFrameNode.getTenFramePath( {
      fill: null,
      lineWidth: 3
    } );

    super( {
      content: tenFramePath,
      size: new Dimension2( SIDE_LENGTH, SIDE_LENGTH - 0.5 ), // tweak to match height of closed accordion box
      xMargin: 4,
      baseColor: color,
      listener: listener
    } );
  }
}

numberPlay.register( 'OrganizeButton', OrganizeButton );
export default OrganizeButton;