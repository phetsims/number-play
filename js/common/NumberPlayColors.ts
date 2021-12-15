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
const WHITE_BACKGROUND = new Color( 255, 255, 255 );

const NumberPlayColors = {

  // screen backgrounds
  tenScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'tenScreenBackgroundColor', {
    default: LIGHT_GREEN_BACKGROUND
  } ),
  twentyScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'twentyScreenBackgroundColor', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),
  compareScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'compareScreenBackgroundColor', {
    default: WHITE_BACKGROUND
  } ),
  gameScreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'gameScreenBackgroundColor', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),

  // backgrounds for accordion boxes and more
  greenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'greenBackgroundColor', {
    default: new Color( 159, 237, 172 )
  } ),
  mediumGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumGreenBackgroundColor', {
    default: new Color( 150, 226, 168 )
  } ),
  lightGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightGreenBackgroundColor', {
    default: LIGHT_GREEN_BACKGROUND
  } ),
  orangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'orangeBackgroundColor', {
    default: new Color( 249, 210, 172 )
  } ),
  mediumOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumOrangeBackgroundColor', {
    default: new Color( 247, 209, 159 )
  } ),
  lightOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightOrangeBackgroundColor', {
    default: LIGHT_ORANGE_BACKGROUND
  } ),
  purpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'purpleBackgroundColor', {
    default: new Color( 252, 220, 255 )
  } ),
  blueBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'blueBackgroundColor', {
    default: new Color( 204, 239, 255 )
  } ),
  whiteBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'whiteBackgroundColor', {
    default: WHITE_BACKGROUND
  } ),

  // game screen level colors
  countingGameColorProperty: new ProfileColorProperty( numberPlay, 'countingGameColor', {
    default: new Color( 242, 142, 129 )
  } ),
  countingGameLightColorProperty: new ProfileColorProperty( numberPlay, 'countingGameLightColor', {
    default: new Color( 245, 188, 181 )
  } ),
  subitizeGameColorProperty: new ProfileColorProperty( numberPlay, 'subitizeGameColor', {
    default: new Color( 148, 133, 255 )
  } ),
  subitizeGameLightColorProperty: new ProfileColorProperty( numberPlay, 'subitizeGameLightColor', {
    default: new Color( 195, 193, 247 )
  } )
};

numberPlay.register( 'NumberPlayColors', NumberPlayColors );
export default NumberPlayColors;