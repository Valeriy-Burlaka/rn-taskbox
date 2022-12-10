import { createIconSet } from '@expo/vector-icons';

export const glyphMap = {
  'heart-empty': 59392,
  'star-empty': 59393,
  'thumbs-up': 59394,
  'music': 59395,
  'flight': 59396,
  'video': 59397,
  'wrench': 59398,
  'shopping-cart': 59399,
  'calendar': 59400,
  'home': 59401,
  'mail': 59402,
  'thumbs-down': 59403,
  'picture': 59404,
  'trash-empty': 59405,
  'bookmark-empty': 61591,
  'beaker': 61635,
  'list-bullet': 61642,
  'money': 61654,
  'comment-empty': 61669,
  'chat-empty': 61670,
  'stethoscope': 61681,
  'building': 61687,
  'medkit': 61690,
  'smile': 61720,
  'frown': 61721,
  'gamepad': 61723,
  'mic': 61744,
  'euro': 61779,
  'dollar': 61781,
  'bitcoin': 61786,
  'paw': 61872,
  'paper-plane-empty': 61913,
  'soccer-ball': 61923,
  'bicycle': 61958,
  'diamond': 61977,
  'user-secret': 61979,
  'heartbeat': 61982,
  'bed': 62006,
  'subway': 62009,
  'hourglass-3': 62035,
  'television': 62060,
  'map-o': 62072
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
