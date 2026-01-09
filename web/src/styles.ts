/**
 * Style constants for imuendo (structural, non-color values)
 * Based on Flokk's styles.dart
 *
 * This file contains:
 * - Breakpoints, sizes, spacing
 * - Durations, animations, curves
 * - Fonts, font sizes, text styles
 * - Avatar sizing configuration
 *
 * For colors and color-dependent values, see theme.ts
 */

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
  // H2: Lato, 12px, bold (column headers in lists)
  h2: {
    fontFamily: Fonts.primary,
    fontSize: '12px',
    fontWeight: 700,
  },
} as const;

// =============================================================================
// AVATAR CONFIGURATION
// =============================================================================

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

/**
 * Avatar typography configuration.
 * Controls how initials are rendered inside avatars.
 */
export const AvatarConfig = {
  fontRatio: 0.4,      // Font size = 40% of avatar size
  letterSpacing: 1,    // px between initials
  fontWeight: 700,     // Bold
} as const;
