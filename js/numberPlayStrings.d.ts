// Copyright 2021, University of Colorado Boulder

//TODO-TS https://github.com/phetsims/chipper/issues/1139 what pattern should be used here?

type t = {
  [ key: string ]: string,
  'number-play': {
    title: string,
  },
  screen: {
    [ key: string ]: string,
  }
};
let numberPlayStrings: t;
export default numberPlayStrings;