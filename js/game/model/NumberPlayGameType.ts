// Copyright 2021-2022, University of Colorado Boulder

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import RichEnumeration from '../../../../phet-core/js/RichEnumeration.js';
import numberPlay from '../../numberPlay.js';
import numberPlayStrings from '../../numberPlayStrings.js';
import subitizeGameIcon1_png from '../../../images/subitizeGameIcon1_png.js';
import countingGameIcon1_png from '../../../images/countingGameIcon1_png.js';
import subitizeGameIcon2_png from '../../../images/subitizeGameIcon2_png.js';
import countingGameIcon2_png from '../../../images/countingGameIcon2_png.js';

/**
 *  NumberPlayGameType identifies the game type in Number Play.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

type levelImagesType = {
  [ key: number ]: HTMLImageElement
}

class NumberPlayGameType extends EnumerationValue {
  static COUNTING = new NumberPlayGameType( numberPlayStrings.counting, {
    1: countingGameIcon1_png,
    2: countingGameIcon2_png
  } );

  static SUBITIZE = new NumberPlayGameType( numberPlayStrings.subitize, {
    1: subitizeGameIcon1_png,
    2: subitizeGameIcon2_png
  } );

  static enumeration = new RichEnumeration<NumberPlayGameType>( NumberPlayGameType );

  public readonly gameName: string;
  public readonly levelImages: levelImagesType;

  private constructor( gameName: string, levelImages: levelImagesType ) {
    super();

    this.gameName = gameName;
    this.levelImages = levelImages;
  }
}

numberPlay.register( 'NumberPlayGameType', NumberPlayGameType );
export default NumberPlayGameType;
