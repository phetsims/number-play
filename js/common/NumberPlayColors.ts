// Copyright 2021, University of Colorado Boulder

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
  greenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'greenBackgroundColor', {
    default: new Color( 224, 211, 205 )
  } ),
  mediumGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumGreenBackgroundColor', {
    default: new Color( 207, 190, 190 )
  } ),
  lighterGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lighterGreenBackgroundColor', {
    default: new Color( 238, 231, 231 )
  } ),
  lightGreenBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightGreenBackgroundColor', {
    default: new Color( 245, 245, 245 )
  } ),
  orangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'orangeBackgroundColor', {
    default: new Color( 249, 210, 172 )
  } ),
  mediumOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'mediumOrangeBackgroundColor', {
    default: new Color( 247, 209, 159 )
  } ),
  lightOrangeBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'lightOrangeBackgroundColor', {
    default: new Color( 255, 247, 235 )
  } ),
  purpleBackgroundColorProperty: new ProfileColorProperty( numberPlay, 'purpleBackgroundColor', {
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