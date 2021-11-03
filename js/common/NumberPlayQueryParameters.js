// Copyright 2021, University of Colorado Boulder

import numberPlay from '../numberPlay.js';
import NumberPlayConstants from './NumberPlayConstants.js';

/**
 * NumberPlayQueryParameters defines query parameters that are specific to this simulation.
 *
 * @author Luisa Vargas
 */

const NumberPlayQueryParameters = QueryStringMachine.getAll( {

  // always show the correct answer
  // For internal use only, not public facing.
  showCorrectAnswer: { type: 'flag' },

  // time the subitizer node is shown
  subitizerTimeVisible: {
    public: true,
    type: 'number',
    defaultValue: NumberPlayConstants.SUBITIZER_TIME_VISIBLE
  }

} );

numberPlay.register( 'NumberPlayQueryParameters', NumberPlayQueryParameters );
export default NumberPlayQueryParameters;