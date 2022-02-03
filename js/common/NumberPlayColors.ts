// Copyright 2021-2022, University of Colorado Boulder

/**
 * NumberPlayColors defines the colors for this simulation.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import { Color, ProfileColorProperty } from '../../../scenery/js/imports.js';
import numberPlay from '../numberPlay.js';

const NumberPlayColors = {

  // backgrounds for screens, accordion boxes, and more. they are named by color instead of by what they are
  // used for because so many are reused for multiple applications and should remain in sync.
  purpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'purpleBackgroundColor', {
    default: new Color( 214, 209, 255 )
  } ),
  purpleHighlightColorProperty: new ProfileColorProperty( numberPlay, 'purpleHighlightColor', {
    default: new Color( 200, 194, 255 )
  } ),
  mediumPurpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumPurpleBackgroundColor', {
    default: new Color( 238, 238, 255 )
  } ),
  lightPurpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightPurpleBackground', {
    default: new Color( 248, 248, 255 )
  } ),
  orangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'orangeBackgroundColor', {
    default: new Color( 249, 210, 172 )
  } ),
  orangeHighlightColorProperty: new ProfileColorProperty( numberPlay, 'orangeHighlightColor', {
    default: new Color( 247, 209, 159 )
  } ),
  lightOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightOrangeBackgroundColor', {
    default: new Color( 255, 247, 235 )
  } ),
  pinkBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'pinkBackgroundColor', {
    default: new Color( 252, 220, 255 )
  } ),
  blueBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'blueBackgroundColor', {
    default: new Color( 204, 239, 255 )
  } ),
  whiteBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'whiteBackgroundColor', {
    default: new Color( 255, 255, 255 )
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