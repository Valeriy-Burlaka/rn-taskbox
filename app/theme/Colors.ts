const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

// https://www.w3schools.com/tags/ref_colornames.asp
export const palette = {
  AliceBlue: '#F0F8FF',
  BlueViolet: '#8A2BE2',
  Crimson: '#DC143C',
  DarkGoldenRod: '#B8860B',
  DimGray: '#696969',
  Gold: '#FFD700',
  GoldenRod: '#DAA520',
  GreenYellow: '#ADFF2F',
  LightBlue: '#ADD8E6',
  LightCoral: '#F08080',
  LightPink: '#FFB6C1',
  LightSkyBlue: '#87CEFA',
  LimeGreen: '#32CD32',
  Orange: '#FFA500',
  OrangeRed: '#FF4500',
  Purple: '#800080',
  SandyBrown: '#F4A460',
  SkyBlue: '#87CEEB',
  SteelBlue: '#4682B4'
};

export type PaletteColor = typeof palette[keyof typeof palette];

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
