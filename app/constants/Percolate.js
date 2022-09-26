/**
 * PercolateIcons icon set component.
 * Usage: <PercolateIcons name="icon-name" size={20} color="#4F8EF7" />
 */

 import { createIconSet } from '@expo/vector-icons';
 
 const glyphMap = {
   graphql: 59658,
   redux: 59656,
   grid: 59657,
   redirect: 59655,
   grow: 59651,
   lightning: 59652,
   'request-change': 59653,
   transfer: 59654,
   calendar: 59650,
   sidebar: 59648,
   tablet: 59649,
   atmosphere: 58993,
   browser: 58994,
   database: 58995,
   'expand-alt': 58996,
   mobile: 58997,
   watch: 58998,
   home: 58880,
   'user-alt': 58881,
   user: 58882,
   'user-add': 58883,
   users: 58884,
   profile: 58885,
   bookmark: 58886,
   'bookmark-hollow': 58887,
   star: 58888,
   'star-hollow': 58889,
   circle: 58890,
   'circle-hollow': 58891,
   heart: 58892,
   'heart-hollow': 58893,
   'face-happy': 58894,
   'face-sad': 58895,
   'face-neutral': 58896,
   lock: 58897,
   unlock: 58898,
   key: 58899,
   'arrow-left-alt': 58900,
   'arrow-right-alt': 58901,
   sync: 58902,
   reply: 58903,
   expand: 58904,
   'arrow-left': 58905,
   'arrow-up': 58906,
   'arrow-down': 58907,
   'arrow-right': 58908,
   'chevron-down': 58909,
   back: 58910,
   download: 58911,
   upload: 58912,
   proceed: 58913,
   info: 58914,
   question: 58915,
   alert: 58916,
   edit: 58917,
   paintbrush: 58918,
   close: 58919,
   trash: 58920,
   cross: 58921,
   delete: 58922,
   power: 58923,
   add: 58924,
   plus: 58925,
   document: 58926,
   'graph-line': 58927,
   'doc-chart': 58928,
   'doc-list': 58929,
   category: 58930,
   copy: 58931,
   book: 58932,
   certificate: 58934,
   print: 58935,
   'list-unordered': 58936,
   'graph-bar': 58937,
   menu: 58938,
   filter: 58939,
   ellipsis: 58940,
   cog: 58941,
   wrench: 58942,
   nut: 58943,
   camera: 58944,
   eye: 58945,
   photo: 58946,
   video: 58947,
   speaker: 58948,
   phone: 58949,
   flag: 58950,
   pin: 58951,
   compass: 58952,
   globe: 58953,
   location: 58954,
   search: 58955,
   timer: 58956,
   time: 58957,
   dashboard: 58958,
   hourglass: 58959,
   play: 58960,
   stop: 58961,
   email: 58962,
   comment: 58963,
   link: 58964,
   paperclip: 58965,
   box: 58966,
   structure: 58967,
   commit: 58968,
   cpu: 58969,
   memory: 58970,
   outbox: 58971,
   share: 58972,
   button: 58973,
   check: 58974,
   form: 58975,
   admin: 58976,
   paragraph: 58977,
   bell: 58978,
   rss: 58979,
   basket: 58980,
   credit: 58981,
   support: 58982,
   shield: 58983,
   beaker: 58984,
   google: 58985,
   gdrive: 58986,
   youtube: 58987,
   facebook: 58988,
   'thumbs-up': 58989,
   twitter: 58990,
   github: 58991,
   meteor: 58992,
 };
 
 const PercolateIcons = createIconSet(glyphMap, 'percolate');
 
 export default PercolateIcons;
 
 export const Button = PercolateIcons.Button;
 export const TabBarItem = PercolateIcons.TabBarItem;
 export const TabBarItemIOS = PercolateIcons.TabBarItemIOS;
 export const ToolbarAndroid = PercolateIcons.ToolbarAndroid;
 export const getImageSource = PercolateIcons.getImageSource;
