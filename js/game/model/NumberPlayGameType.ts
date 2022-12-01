// Copyright 2021-2022, University of Colorado Boulder

import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import numberPlay from '../../numberPlay.js';
import NumberPlayStrings from '../../NumberPlayStrings.js';
import subitizeGameIcon1_png from '../../../images/subitizeGameIcon1_png.js';
import countingGameIcon1_png from '../../../images/countingGameIcon1_png.js';
import subitizeGameIcon2_png from '../../../images/subitizeGameIcon2_png.js';
import countingGameIcon2_png from '../../../images/countingGameIcon2_png.js';
import LinkableProperty from '../../../../axon/js/LinkableProperty.js';

/**
 *  NumberPlayGameType identifies the game type in Number Play.
 *
 * @author Luisa Vargas
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

type LevelDescriptions = Record<number, LinkableProperty<string>>;
type LevelImages = Record<number, HTMLImageElement>;

class NumberPlayGameType extends EnumerationValue {
  public static readonly COUNTING = new NumberPlayGameType( {
    1: NumberPlayStrings.countingLevel1DescriptionStringProperty,
    2: NumberPlayStrings.countingLevel2DescriptionStringProperty
  }, {
    1: countingGameIcon1_png,
    2: countingGameIcon2_png
  } );

  public static readonly SUBITIZE = new NumberPlayGameType( {
    1: NumberPlayStrings.subitizingLevel1DescriptionStringProperty,
    2: NumberPlayStrings.subitizingLevel2DescriptionStringProperty
  }, {
    1: subitizeGameIcon1_png,
    2: subitizeGameIcon2_png
  } );

  public static readonly enumeration = new Enumeration( NumberPlayGameType );

  public readonly levelDescriptions: LevelDescriptions;
  public readonly levelImages: LevelImages;

  public constructor( levelDescriptions: LevelDescriptions, levelImages: LevelImages ) {
    super();

    this.levelDescriptions = levelDescriptions;
    this.levelImages = levelImages;
  }
}

numberPlay.register( 'NumberPlayGameType', NumberPlayGameType );
export default NumberPlayGameType;
