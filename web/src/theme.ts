/**
 * Theme constants for imuendo
 * Centralized values for colors, sizes, spacing, and animations
 * Based on Flokk's FlockGreen theme
 */

// =============================================================================
// COLORS
// =============================================================================

export const Colors = {
  // Text
  txt: '#000000',
  accentTxt: '#ffffff',

  // Backgrounds
  bg1: '#f1f7f0',
  bg2: '#c1dcbc',
  surface: '#ffffff',

  // Accent colors
  accent1: '#00a086',
  accent1Dark: '#00856f',
  accent1Darker: '#006b5a',
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
// BREAKPOINTS (matching Tailwind config)
// =============================================================================

export const PageBreaks = {
  LargePhone: 550,
  TabletPortrait: 768,
  TabletLandscape: 1024,
  Desktop: 1440,
} as const;

// =============================================================================
// SIZES
// =============================================================================

export const Sizes = {
  // Sidebar (from Flokk styles.dart)
  sideBarSm: 150,   // TabletPortrait (768-1023px) - skinnyMode
  sideBarMed: 200,  // TabletLandscape (1024-1439px)
  sideBarLg: 290,   // Desktop (≥1440px)

  // Fixed heights
  headerHeight: 106,
  buttonHeight: 60,

  // Indicator
  indicatorWidth: 6,
  indicatorHeight: 48,

  // Panel
  panelWidth: 384,  // w-96

  // Border radius (from Flokk Corners)
  radiusBtn: 8,    // Corners.s8 - button radius
  radiusSm: 8,
  radiusMd: 10,
  radiusLg: 12,

  // Sidebar button icons (from Flokk main_side_menu_btn.dart)
  // Note: Flokk uses iconSize - 4 for actual render, but our SVGs have viewBox 24x24
  // so we use slightly larger values for equivalent visual weight
  iconSizeNav: 24,     // Flokk: 26 - 4 = 22, but we use 24 to match SVG viewBox
  iconSizeCreate: 20,  // Flokk: 20 - 4 = 16, adjusted proportionally
  iconPadding: 2,      // EdgeInsets.all(2.0)
} as const;

// =============================================================================
// SPACING (Insets)
// =============================================================================

export const Insets = {
  // From Flokk styles.dart
  xs: 2,
  sm: 6,
  m: 12,
  l: 24,
  xl: 36,

  // Gutters
  mGutter: 12,
  lGutter: 24,

  // Sidebar button specific (from main_side_menu_btn.dart)
  btnPaddingLeft: 24,    // HSpace(Insets.l)
  btnIconTextGap: 12,    // HSpace(Insets.l * .5)
} as const;

// =============================================================================
// ANIMATIONS
// =============================================================================

export const Durations = {
  // In milliseconds
  fastest: 100,
  fast: 200,
  medium: 300,
  slow: 350,
  slower: 500,
} as const;

// CSS duration strings
export const DurationCSS = {
  fastest: '100ms',
  fast: '200ms',
  medium: '300ms',
  slow: '350ms',
  slower: '500ms',
} as const;

// Easing functions
export const Curves = {
  easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
  easeInOut: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// Animation presets for Tailwind-style inline styles
export const Animations = {
  // Indicator movement (0.5s easeOutBack)
  indicator: {
    duration: DurationCSS.slower,
    easing: Curves.easeOutBack,
  },
  // Panel slide (0.35s easeOut)
  panel: {
    duration: DurationCSS.slow,
    easing: Curves.easeOut,
  },
  // Button hover (0.3s easeOut)
  button: {
    duration: DurationCSS.medium,
    easing: Curves.easeOut,
  },
  // Layout changes (0.35s easeOut)
  layout: {
    duration: DurationCSS.slow,
    easing: Curves.easeOut,
  },
} as const;

// =============================================================================
// FONTS
// =============================================================================

export const Fonts = {
  primary: "'Lato', system-ui, sans-serif",
  heading: "'Quicksand', sans-serif",
} as const;

export const FontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
} as const;

// Text styles from Flokk (for sidebar buttons)
export const TextStyles = {
  // Btn: Quicksand, 14px, bold, letterSpacing 1.75
  btn: {
    fontFamily: Fonts.heading,
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '1.75px',
  },
  // BtnSelected: same but regular weight
  btnSelected: {
    fontFamily: Fonts.heading,
    fontSize: '14px',
    fontWeight: 400,
    letterSpacing: '1.75px',
  },
  // Caption: lato, 11px, letterSpacing 0.3
  caption: {
    fontFamily: Fonts.primary,
    fontSize: '11px',
    fontWeight: 400,
    letterSpacing: '0.3px',
  },
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

export const Shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  panel: `0 10px 40px -10px ${Colors.accent1Darker}40`,
} as const;
