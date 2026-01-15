/**
 * Theme constants for imuendo (colors and color-dependent values)
 * Based on Flokk's themes.dart (FlockGreen theme)
 *
 * This file contains:
 * - Colors
 * - Shadows (color-dependent)
 * - Avatar color themes
 *
 * For structural values (sizes, spacing, fonts), see styles.ts
 */

// =============================================================================
// COLORS
// =============================================================================

export const Colors = {
  // Text
  txt: '#000000',
  txtDark: '#101D1B',  // Header search bar text
  accentTxt: '#ffffff',

  // Backgrounds
  bg1: '#f1f7f0',
  bg2: '#c1dcbc',
  surface: '#ffffff',

  // Accent colors
  accent1: '#00a086',
  accent1Dark: '#00856f',
  accent1Darker: '#006b5a',
  accent1Selected: '#116d5c',  // BorderButton selected state
  accent2: '#f09433',
  accent3: '#5bc91a',

  // Greys
  greyWeak: '#909f9c',
  grey: '#515d5a',
  greyStrong: '#151918',

  // Semantic
  error: '#b71c1c',
  focus: '#0ee2b1',

  // Header
  headerTitle: '#116d5c',
} as const;

// =============================================================================
// SHADOWS (color-dependent)
// =============================================================================

export const Shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  panel: `0 10px 40px -10px ${Colors.accent1Darker}40`,
  // SearchBar shadow: Shadows.m(theme.accent1Darker) from Flokk
  searchBar: `0 4px 12px -2px ${Colors.accent1Darker}30`,
} as const;

// =============================================================================
// AVATAR THEMES (inspired by Flokk bird colors)
// =============================================================================

/**
 * 10 unique avatar color themes, each inspired by a Flokk bird.
 * Each theme has:
 * - background: the avatar circle background color
 * - letter1: color for the first initial
 * - letter2: color for the second initial
 */
export const AvatarThemes = [
  // 0: Flamingo - salmon pink + dark grey on blue
  { background: '#3366D9', letter1: '#E8A0A0', letter2: '#4A4A4A' },
  // 1: Hummingbird - sky blue + brown on magenta
  { background: '#D946B9', letter1: '#4AA3D5', letter2: '#8B5A3C' },
  // 2: Owl - orange + yellow on violet
  { background: '#6633D9', letter1: '#E87D3E', letter2: '#F5D76E' },
  // 3: Parrot - pink/red + blue on lime
  { background: '#A3D939', letter1: '#D96B6B', letter2: '#3498DB' },
  // 4: Peacock - blue + green on red
  { background: '#D93D43', letter1: '#4A90D9', letter2: '#5DAE5D' },
  // 5: Pelican - orange + grey on emerald
  { background: '#33D96A', letter1: '#F5A623', letter2: '#9B9B9B' },
  // 6: Penguin - black + yellow on turquoise
  { background: '#33D9C9', letter1: '#2D2D2D', letter2: '#F5D547' },
  // 7: Swan - light grey + yellow/orange on peacock blue
  { background: '#4A90D9', letter1: '#C5C5C5', letter2: '#E8A547' },
  // 8: Toucan - yellow + pink on peacock green
  { background: '#5DAE5D', letter1: '#F5D033', letter2: '#E88B8B' },
  // 9: Woodpecker - red + orange on orchid
  { background: '#B933D9', letter1: '#D94B4B', letter2: '#E87D3E' },
] as const;
