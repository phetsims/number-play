// Copyright 2021, University of Colorado Boulder

/**
 * NumberPlayColors defines the colors for this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import numberPlay from '../numberPlay.js';

// constants used to define multiple colors
const LIGHT_GREEN_BACKGROUND = new Color( 215, 255, 227 );
const LIGHT_ORANGE_BACKGROUND = new Color( 255, 247, 235 );

const NumberPlayColors = {

  // screen backgrounds
  tenScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'tenScreenBackgroundColorProperty', {
    default: LIGHT_GREEN_BACKGROUND
  } ),
  twentyScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'twentyScreenBackgroundColorProperty', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),
  gameScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'gameScreenBackgroundColorProperty', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),

  // accordion box backgrounds
  greenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'greenBackgroundColorProperty', {
    default: new Color( 159, 237, 172 )
  } ),
  mediumGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumGreenBackgroundColorProperty', {
    default: new Color( 150, 226, 168 )
  } ),
  lightGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightGreenBackgroundColorProperty', {
    default: LIGHT_GREEN_BACKGROUND
  } ),
  orangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'orangeBackgroundColorProperty', {
    default: new Color( 249, 210, 172 )
  } ),
  mediumOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumOrangeBackgroundColorProperty', {
    default: new Color( 247, 209, 159 )
  } ),
  lightOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightOrangeBackgroundColorProperty', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),
  purpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'purpleBackgroundColorProperty', {
    default: new Color( 252, 220, 255 )
  } ),
  blueBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'blueBackgroundColorProperty', {
    default: new Color( 204, 239, 255 )
  } ),
  whiteBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'whiteBackgroundColorProperty', {
    default: Color.WHITE
  } ),

  // game screen level colors
  countingGameColorProperty: new ProfileColorProperty( numberPlay, 'countingGameColorProperty', {
    default: new Color( 242, 142, 129 )
  } ),
  countingGameLightColorProperty: new ProfileColorProperty( numberPlay, 'countingGameLightColorProperty', {
    default: new Color( 245, 188, 181 )
  } ),
  subitizeGameColorProperty: new ProfileColorProperty( numberPlay, 'subitizeGameColorProperty', {
    default: new Color( 148, 133, 255 )
  } ),
  subitizeGameLightColorProperty: new ProfileColorProperty( numberPlay, 'subitizeGameLightColorProperty', {
    default: new Color( 195, 193, 247 )
  } )
};

numberPlay.register( 'NumberPlayColors', NumberPlayColors );
export default NumberPlayColors;