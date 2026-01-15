import { useState, useEffect, useRef } from 'react';
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

export function Header({ onCreateContribuente, onOpenImmobileForm, isSearchSelected, onSearchToggle, onSearchCancel }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasFullyExpanded, setHasFullyExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const rightButtonsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const prevIsSearchSelected = useRef(isSearchSelected);

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
      }, Durations.medium);  // 350ms - wait for BorderButton extension
      return () => clearTimeout(timer);
    }
  }, [isSearchSelected]);

  // Track when fully expanded (850ms after selection)
  useEffect(() => {
    if (isSearchSelected) {
      const timer = setTimeout(() => {
        setHasFullyExpanded(true);
      }, Durations.medium + Durations.mediumSlow);  // 350ms + 500ms = 850ms
      return () => clearTimeout(timer);
    } else {
      setHasFullyExpanded(false);
    }
  }, [isSearchSelected]);

  // Detect close and trigger reverse animation
  useEffect(() => {
    // Detect transition from selected to not selected
    if (prevIsSearchSelected.current && !isSearchSelected) {
      if (hasFullyExpanded) {
        // Start closing animation
        setIsClosing(true);
        // After animation, reset states
        const timer = setTimeout(() => {
          setIsClosing(false);
          setIsExpanded(false);
          setSearchQuery('');
        }, Durations.medium);  // 350ms reverse animation
        return () => clearTimeout(timer);
      } else {
        // Not fully expanded, close immediately
        setIsExpanded(false);
        setSearchQuery('');
      }
    }
    prevIsSearchSelected.current = isSearchSelected;
  }, [isSearchSelected, hasFullyExpanded]);

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

  // Show search elements when selected OR during closing animation
  const showSearchElements = isSearchSelected || isClosing;

  // SearchBar position: center at 40px from bottom = center at y=60 from top
  // SearchBar height = 60, so top = 60 - 30 = 30 from top of shape
  const searchBarTop = 30;
  const searchBarHeight = 60;

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
          opacity: (isExpanded && !isClosing) ? 0 : 1,
          transition: `opacity ${Durations.medium}ms ease-out`,
        }}
      />

      {/* Search BorderButton container */}
      <div
        ref={searchButtonRef}
        style={{
          marginLeft: 10,
          alignSelf: 'flex-start',
          // Hidden when expanded (not closing), visible otherwise
          opacity: (isExpanded && !isClosing) ? 0 : 1,
          transition: `opacity ${Durations.fast}ms ease-out`,
          pointerEvents: (isExpanded && !isClosing) ? 'none' : 'auto',
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
            pointerEvents: (isExpanded && !isClosing) ? 'auto' : 'none',
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
              // When expanded (not closing): full width with padding
              // When not expanded or closing: 60px circle centered in shape
              left: (isExpanded && !isClosing) ? 20 : 20,
              right: (isExpanded && !isClosing) ? 20 : undefined,
              width: (isExpanded && !isClosing) ? undefined : 60,
              height: searchBarHeight,
              backgroundColor: '#F1F7F0',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: (isExpanded && !isClosing) ? 'flex-start' : 'center',
              // paddingLeft: 10 keeps Cancel button centered in left semicircle (center at x=30)
              paddingLeft: (isExpanded && !isClosing) ? 10 : 0,
              paddingRight: (isExpanded && !isClosing) ? 20 : 0,
              transition: `left ${Durations.medium}ms ease-out, right ${Durations.medium}ms ease-out, width ${Durations.medium}ms ease-out, padding ${Durations.medium}ms ease-out`,
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

            {/* Input field - only visible when expanded and not closing */}
            {(isExpanded && !isClosing) && (
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
