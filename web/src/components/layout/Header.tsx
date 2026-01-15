import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Colors } from '../../theme';
import { Sizes, Durations, Fonts } from '../../styles';
import { BorderButton } from '../BorderButton';
import imuendoLogo from '../../assets/logos/imuendo_h60.svg';
import searchIcon from '../../assets/buttons/search.svg';
import userAddIcon from '../../assets/buttons/user_add.svg';
import automateIcon from '../../assets/buttons/automate.svg';
import cancelIcon from '../../assets/Cancel_form.svg';

interface HeaderProps {
  onCreateContribuente?: () => void;
  onOpenImmobileForm?: () => void;
  isSearchSelected?: boolean;
  onSearchToggle?: () => void;
  onSearchCancel?: () => void;
  onClosingComplete?: () => void;  // Called when search closing animation finishes
}

// Generate SVG path for expanding search shape (same logic as BorderButton)
function getExpandingPath(width: number, depth: number) {
  const r = 10;  // Edge raccord radius
  const R = 40;  // Internal corner radius
  const k = 0.5523; // Bezier control point for quarter circle
  const kr = r * k;
  const kR = R * k;
  const L = width;
  const D = depth;

  // Same path as BorderButton position="top" but with dynamic width
  const bottomEdgeLength = L - 2 * r - 2 * R;

  if (bottomEdgeLength > 0) {
    return `
      M0 0
      C${kr} 0 ${r} ${r - kr} ${r} ${r}
      L${r} ${D - R}
      C${r} ${D - R + kR} ${r + R - kR} ${D} ${r + R} ${D}
      L${L - r - R} ${D}
      C${L - r - R + kR} ${D} ${L - r} ${D - R + kR} ${L - r} ${D - R}
      L${L - r} ${r}
      C${L - r} ${r - kr} ${L - kr} 0 ${L} 0
      Z
    `;
  } else {
    const midX = L / 2;
    return `
      M0 0
      C${kr} 0 ${r} ${r - kr} ${r} ${r}
      L${r} ${D - R}
      C${r} ${D - R + kR} ${midX - kR} ${D} ${midX} ${D}
      C${midX + kR} ${D} ${L - r} ${D - R + kR} ${L - r} ${D - R}
      L${L - r} ${r}
      C${L - r} ${r - kr} ${L - kr} 0 ${L} 0
      Z
    `;
  }
}

export function Header({ onCreateContribuente, onOpenImmobileForm, isSearchSelected, onSearchToggle, onSearchCancel, onClosingComplete }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const rightButtonsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const prevIsSearchSelected = useRef(isSearchSelected);
  const hasFullyExpandedRef = useRef(false);
  const closingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Positions for animation
  const [searchButtonLeft, setSearchButtonLeft] = useState(0);
  const [rightButtonsLeft, setRightButtonsLeft] = useState(0);
  const [logoWidth, setLogoWidth] = useState(0);

  // Measure positions
  useEffect(() => {
    const updatePositions = () => {
      const headerEl = searchButtonRef.current?.closest('header');
      if (!headerEl) return;
      const headerRect = headerEl.getBoundingClientRect();

      if (searchButtonRef.current) {
        const rect = searchButtonRef.current.getBoundingClientRect();
        setSearchButtonLeft(rect.left - headerRect.left);
      }
      if (rightButtonsRef.current) {
        const rect = rightButtonsRef.current.getBoundingClientRect();
        setRightButtonsLeft(rect.left - headerRect.left);
      }
      if (logoRef.current) {
        setLogoWidth(logoRef.current.offsetWidth);
      }
    };

    // Initial measurement after render
    const timer = setTimeout(updatePositions, 50);
    window.addEventListener('resize', updatePositions);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePositions);
    };
  }, []);

  // Phase 2: Expand after BorderButton extends
  useEffect(() => {
    if (isSearchSelected) {
      const timer = setTimeout(() => {
        setIsExpanded(true);
      }, Durations.fastest);  // 150ms - quick delay before expansion
      return () => clearTimeout(timer);
    }
  }, [isSearchSelected]);

  // Track when fully expanded (150ms + 500ms = 650ms after selection)
  useEffect(() => {
    if (isSearchSelected) {
      const timer = setTimeout(() => {
        hasFullyExpandedRef.current = true;
      }, Durations.fastest + Durations.mediumSlow);  // 150ms + 500ms = 650ms
      return () => {
        clearTimeout(timer);
      };
    }
    // NOTE: Don't reset hasFullyExpandedRef here! It's checked by the closing useEffect
    // and reset there after the animation completes.
  }, [isSearchSelected]);

  // Detect close and trigger reverse animation - useLayoutEffect to set isClosing BEFORE paint
  useLayoutEffect(() => {
    // Detect transition from selected to not selected
    if (prevIsSearchSelected.current && !isSearchSelected) {
      // Clear any existing closing timer
      if (closingTimerRef.current) {
        clearTimeout(closingTimerRef.current);
      }

      const wasFullyExpanded = hasFullyExpandedRef.current;
      hasFullyExpandedRef.current = false;  // Reset here

      if (wasFullyExpanded) {
        // Start closing animation
        setIsClosing(true);
        // After animation, reset states and notify parent
        closingTimerRef.current = setTimeout(() => {
          setIsClosing(false);
          setIsExpanded(false);
          setSearchQuery('');
          closingTimerRef.current = null;
          onClosingComplete?.();  // Notify parent that closing is complete
        }, Durations.medium);  // 350ms - faster closing
      } else {
        // Not fully expanded, close immediately
        setIsExpanded(false);
        setSearchQuery('');
      }
    }
    prevIsSearchSelected.current = isSearchSelected;
  }, [isSearchSelected]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (closingTimerRef.current) {
        clearTimeout(closingTimerRef.current);
      }
    };
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && !isClosing) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, Durations.mediumSlow);  // 500ms - sync with expansion animation
      return () => clearTimeout(timer);
    }
  }, [isExpanded, isClosing]);

  // Animation values
  const depth = 100; // Selected BorderButton depth
  const buttonWidth = 100; // Original BorderButton width

  // Expanded shape dimensions
  // When closing, animate back to original position
  const expandedLeft = (isExpanded && !isClosing) ? 0 : searchButtonLeft;
  const expandedWidth = (isExpanded && !isClosing) ? rightButtonsLeft : buttonWidth;

  // Show search elements when selected OR during closing animation OR still expanded
  // isExpanded keeps element in DOM during first render after X click (before isClosing is set)
  const showSearchElements = isSearchSelected || isClosing || isExpanded;

  // Simple check: shape is open when left padding is 0
  const isShapeOpen = expandedLeft === 0;

  // SearchBar position: center at 40px from bottom = center at y=60 from top
  // SearchBar height = 60, so top = 60 - 30 = 30 from top of shape
  const searchBarTop = 30;
  const searchBarHeight = 60;

  // SearchBar width: explicit values for CSS animation
  // When open (expandedLeft === 0): shape width - 40px padding
  // When closed: 60px circle
  const searchBarWidth = isShapeOpen ? (rightButtonsLeft - 40) : 60;

  return (
    <header
      className="flex items-center relative"
      style={{
        backgroundColor: Colors.bg1,
        height: Sizes.headerHeight,
        paddingLeft: 10,
        borderBottom: '1px solid black', // TEMPORARY - debug border
      }}
    >
      {/* Logo - fades out when search expands, fades in when closing */}
      <img
        ref={logoRef}
        src={imuendoLogo}
        alt="imuendo"
        draggable={false}
        style={{
          height: 50,
          width: 'auto',
          opacity: isShapeOpen ? 0 : 1,
          transition: `opacity ${Durations.medium}ms ease-out`,
        }}
      />

      {/* Search BorderButton container */}
      <div
        ref={searchButtonRef}
        style={{
          marginLeft: 10,
          alignSelf: 'flex-start',
          // Hidden when shape is open, visible otherwise
          opacity: isShapeOpen ? 0 : 1,
          transition: `opacity ${Durations.fast}ms ease-out`,
          pointerEvents: isShapeOpen ? 'none' : 'auto',
        }}
      >
        <BorderButton
          position="top"
          icon={<img src={searchIcon} alt="Search" style={{ width: 60, height: 60 }} />}
          onClick={onSearchToggle}
          isSelected={isSearchSelected}
          title="Cerca"
        />
      </div>

      {/* Expanding search shape - appears when selected, contracts when closing */}
      {showSearchElements && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: expandedLeft,
            width: expandedWidth,
            height: depth,
            pointerEvents: isShapeOpen ? 'auto' : 'none',
            // Use mediumSlow (500ms) for opening, medium (350ms) for closing
            transition: `left ${isClosing ? Durations.medium : Durations.mediumSlow}ms ease-out, width ${isClosing ? Durations.medium : Durations.mediumSlow}ms ease-out`,
          }}
        >
          {/* SVG shape with raccords */}
          <svg
            width="100%"
            height={depth}
            viewBox={`0 0 ${expandedWidth} ${depth}`}
            preserveAspectRatio="none"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            <path
              d={getExpandingPath(expandedWidth, depth)}
              fill={Colors.accent1Selected}
            />
          </svg>

          {/* SearchBar inside the expanded shape - starts as circle, expands to pill, contracts when closing */}
          <div
            style={{
              position: 'absolute',
              top: searchBarTop,
              left: 20,
              // Use explicit width for CSS animation (can't transition from auto to fixed)
              width: searchBarWidth,
              height: searchBarHeight,
              backgroundColor: '#F1F7F0',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: isShapeOpen ? 'flex-start' : 'center',
              // paddingLeft: 10 keeps Cancel button centered in left semicircle (center at x=30)
              paddingLeft: isShapeOpen ? 10 : 0,
              paddingRight: isShapeOpen ? 20 : 0,
              transition: `width ${isClosing ? Durations.medium : Durations.mediumSlow}ms ease-out, padding ${isClosing ? Durations.medium : Durations.mediumSlow}ms ease-out`,
            }}
          >
            {/* Cancel button - always visible, red color */}
            <button
              onClick={onSearchCancel}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img
                src={cancelIcon}
                alt="Cancel"
                style={{
                  width: 24,
                  height: 24,
                  filter: 'invert(16%) sepia(95%) saturate(3000%) hue-rotate(350deg) brightness(70%) contrast(100%)',
                }}
              />
            </button>

            {/* Input field - only visible when shape is open */}
            {isShapeOpen && (
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cerca in imuendo"
                className="header-search-input"
                style={{
                  flex: 1,
                  height: '100%',
                  marginLeft: 10,  // Placeholder starts 30px from semicircle center
                  backgroundColor: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontFamily: Fonts.primary,
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: 0,
                  color: Colors.txtDark,
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Right side BorderButtons */}
      <div
        ref={rightButtonsRef}
        className="absolute flex"
        style={{
          right: 0,
          top: 0,
          gap: 0,
        }}
      >
        <BorderButton
          position="top"
          icon={<img src={userAddIcon} alt="Nuovo contribuente" style={{ width: 60, height: 60 }} />}
          onClick={onCreateContribuente}
          title="Nuovo contribuente"
        />
        <BorderButton
          position="top"
          icon={<img src={automateIcon} alt="Automate" style={{ width: 60, height: 60 }} />}
          onClick={onOpenImmobileForm}
          title="Automate"
        />
      </div>
    </header>
  );
}
