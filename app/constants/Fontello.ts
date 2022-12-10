import { createIconSet } from '@expo/vector-icons';

export const glyphMap = {
  "attach": 59408,
  "beaker": 61635,
  "bed": 62006,
  "bicycle": 61958,
  "bitcoin": 61786,
  "bookmark-empty": 61591,
  "building": 61687,
  "cab": 61881,
  "calendar": 59400,
  "chat-empty": 61670,
  "coffee": 61684,
  "comment-empty": 61669,
  "diamond": 61977,
  "dollar": 61781,
  "euro": 61779,
  "flight": 59396,
  "frown": 61721,
  "gamepad": 61723,
  "gift": 59406,
  "graduation-cap": 61853,
  "heart-empty": 59392,
  "heartbeat": 61982,
  "home": 59401,
  "hourglass-3": 62035,
  "list-bullet": 61642,
  "mail": 59402,
  "map-o": 62072,
  "medkit": 61690,
  "mic": 61744,
  "money": 61654,
  "moon": 61830,
  "music": 59395,
  "paper-plane-empty": 61913,
  "paw": 61872,
  "picture": 59404,
  "shopping-cart": 59399,
  "smile": 61720,
  "soccer-ball": 61923,
  "star-empty": 59393,
  "stethoscope": 61681,
  "subway": 62009,
  "sun": 61829,
  "television": 62060,
  "thumbs-down": 59403,
  "thumbs-up": 59394,
  "trash-empty": 59405,
  "user": 59407,
  "user-secret": 61979,
  "video": 59397,
  "wrench": 59398
};

// Alternatively, can be loaded using `createIconSetFromFontello`, like:
// 
// import fontelloConfig from 'assets/icon/fontello/config.json';
// 
// and then:
// 
// const FontelloIcon = createIconSetFromFontello(fontelloConfig, 'fontello', 'fontello-icons.ttf');
// 
// but I don't understand the benefit, because we still have to load and cache the `.ttf` font asset,
// and the "fontello" config seems a bit redundant.
export const FontelloIcon = createIconSet(glyphMap, 'fontello', 'fontello-icons.ttf');

/**
 * Script to generate a glyphMap from fontello 'demo.html' page:
 * 
 * Object.fromEntries(Array.from(document.querySelectorAll('.span3')).map(el => [ el.querySelector('.i-name').innerText, el.querySelector('.i-code').innerText ]).map( ([name, hexCode]) => [name.replace('icon-', ''), parseInt(hexCode, 16)]))
 */
