// Copyright 2021-2023, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import LinkableProperty from '../../axon/js/LinkableProperty.js';
import numberPlay from './numberPlay.js';

type StringsType = {
  'number-play': {
    'titleStringProperty': LinkableProperty<string>;
  };
  'screen': {
    'tenStringProperty': LinkableProperty<string>;
    'twentyStringProperty': LinkableProperty<string>;
    'gameStringProperty': LinkableProperty<string>;
  };
  'wordStringProperty': LinkableProperty<string>;
  'wordLanguageStringProperty': LinkableProperty<string>;
  'tenFrameStringProperty': LinkableProperty<string>;
  'tenFramesStringProperty': LinkableProperty<string>;
  'onesStringProperty': LinkableProperty<string>;
  'chooseYourGameStringProperty': LinkableProperty<string>;
  'countingLevel1DescriptionStringProperty': LinkableProperty<string>;
  'countingLevel2DescriptionStringProperty': LinkableProperty<string>;
  'subitizingLevel1DescriptionStringProperty': LinkableProperty<string>;
  'subitizingLevel2DescriptionStringProperty': LinkableProperty<string>;
  'gamesStringProperty': LinkableProperty<string>;
  'automaticallyHearTotalStringProperty': LinkableProperty<string>;
  'automaticallyHearTotalDescriptionStringProperty': LinkableProperty<string>;
  'subitizeTimeStringProperty': LinkableProperty<string>;
  'subitizeTimeDescriptionStringProperty': LinkableProperty<string>;
};

const NumberPlayStrings = getStringModule( 'NUMBER_PLAY' ) as StringsType;

numberPlay.register( 'NumberPlayStrings', NumberPlayStrings );

export default NumberPlayStrings;
