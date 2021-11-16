// Copyright 2021, University of Colorado Boulder

/**
 * SubitizeObjectTypeEnum identifies the play object type in the 'Subitize' game in Number Play.
 *
 * @author Chris Klusendorf (PhET Interactive Simulations)
 * @author Luisa Vargas
 */

import { PlayObjectTypeValues } from '../../common/model/PlayObjectTypeEnum.js';

const SubitizeObjectTypeValues = [ ...PlayObjectTypeValues, 'circle' ] as const;
type SubitizeObjectTypeEnum = ( typeof SubitizeObjectTypeValues )[number];

export { SubitizeObjectTypeValues, SubitizeObjectTypeEnum as default };