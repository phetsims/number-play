// Copyright 2021-2022, University of Colorado Boulder

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
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

type LevelDescriptions = Record<number, string>;
type LevelImages = Record<number, HTMLImageElement>;

class NumberPlayGameType extends EnumerationValue {
  static COUNTING = new NumberPlayGameType( {
    1: numberPlayStrings.countingLevel1Description,
    2: numberPlayStrings.countingLevel2Description
  }, {
    1: countingGameIcon1_png,
    2: countingGameIcon2_png
  } );

  static SUBITIZE = new NumberPlayGameType( {
    1: numberPlayStrings.subitizingLevel1Description,
    2: numberPlayStrings.subitizingLevel2Description
  }, {
    1: subitizeGameIcon1_png,
    2: subitizeGameIcon2_png
  } );

  static enumeration = new Enumeration( NumberPlayGameType );

  public readonly levelDescriptions: LevelDescriptions;
  public readonly levelImages: LevelImages;

  constructor( levelDescriptions: LevelDescriptions, levelImages: LevelImages ) {
    super();

    this.levelDescriptions = levelDescriptions;
    this.levelImages = levelImages;
  }
}

numberPlay.register( 'NumberPlayGameType', NumberPlayGameType );
export default NumberPlayGameType;
