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
  topBarHeight: 60,  // Content area top bar (from Flokk main_scaffold_view.dart)
  buttonHeight: 60,

  // Indicator
  indicatorWidth: 6,
  indicatorHeight: 48,

  // Panel (from Flokk main_scaffold_view.dart)
  panelWidthBase: 400,        // Base detail panel width
  panelWidthGrowthFactor: 12, // Growth per inch above 8"
  panelGrowthThreshold: 8,    // Start growing above 8 inches
  singleColumnThreshold: 10,  // Use single column below 10 inches

  // Border radius (from Flokk Corners)
  radiusBtn: 5,    // Corners.btn = Corners.s5
  radiusSm: 6,     // SearchBar radius
  radiusMd: 10,
  radiusLg: 12,

  // Sidebar button icons
  iconSizeDashboard: 24,    // Dashboard icon
  iconSizeContribuenti: 32, // Contribuenti icon (Group_contribuenti.svg)
  iconSizeCreate: 30,       // Create button icon (User_add_alt.svg)
  iconSizeMed: 20,          // Sizes.iconMed from Flokk
  iconPadding: 2,           // EdgeInsets.all(2.0)

  // Form icons (from Flokk ExpandingMiniformContainer)
  formIconSize: 24,         // Icon size in form rows (24px to match Flokk visual density)
  formIconOffset: 8,        // Icon vertical offset (translateY)
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
  // In milliseconds (from Flokk styles.dart)
  fastest: 150,
  fast: 250,
  medium: 350,
  slow: 700,
  // Custom (not in Flokk)
  slower: 500,  // Indicator animation
} as const;

// CSS duration strings
export const DurationCSS = {
  fastest: '150ms',
  fast: '250ms',
  medium: '350ms',
  slow: '700ms',
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
  // Panel slide (0.35s easeOut) - matches Flokk AnimatedPanel duration
  panel: {
    duration: DurationCSS.medium,
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

// Text styles from Flokk
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
  // T1: Quicksand, 14px, bold, letterSpacing 0.7 (titles/labels)
  t1: {
    fontFamily: Fonts.heading,
    fontSize: '14px',
    fontWeight: 700,
    letterSpacing: '0.7px',
  },
  // Body1: Lato, 14px, regular (form inputs)
  body1: {
    fontFamily: Fonts.primary,
    fontSize: '14px',
    fontWeight: 400,
  },
  // Body2: Lato, 12px, regular
  body2: {
    fontFamily: Fonts.primary,
    fontSize: '12px',
    fontWeight: 400,
  },
  // Body3: Lato, 11px, regular
  body3: {
    fontFamily: Fonts.primary,
    fontSize: '11px',
    fontWeight: 400,
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

/**
 * Avatar sizes from Flokk's StyledUserAvatar usage.
 * Each size corresponds to a specific UI context.
 */
export const AvatarSizes = {
  xs: 36,      // Search results (search_query_results.dart)
  sm: 40,      // Important dates card (important_date_card.dart)
  md: 42,      // Contact/Contribuente list row (contacts_list_row.dart)
  default: 50, // Fallback (styled_user_avatar.dart)
  lg: 60,      // Dashboard small card (small_contact_card.dart)
  xl: 110,     // Detail/Edit panel header (contact_info_header_card.dart, contact_edit_panel_view.dart)
} as const;
