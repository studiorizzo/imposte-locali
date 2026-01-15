import { useState, useEffect, useRef } from 'react';
import { Colors } from '../../theme';
import { Sizes, Durations, Fonts } from '../../styles';
import { BorderButton } from '../BorderButton';
import imuendoLogo from '../../assets/logos/imuendo_h60.svg';
import searchIcon from '../../assets/buttons/search.svg';
import userAddIcon from '../../assets/buttons/user_add.svg';
import automateIcon from '../../assets/buttons/automate.svg';

interface HeaderProps {
  onCreateContribuente?: () => void;
  onOpenImmobileForm?: () => void;
  isSearchSelected?: boolean;
  onSearchToggle?: () => void;
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

export function Header({ onCreateContribuente, onOpenImmobileForm, isSearchSelected, onSearchToggle }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchButtonRef = useRef<HTMLDivElement>(null);
  const rightButtonsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);

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
      }, Durations.slow);
      return () => clearTimeout(timer);
    } else {
      setIsExpanded(false);
      setSearchQuery('');
    }
  }, [isSearchSelected]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, Durations.slow);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Animation values
  const depth = 100; // Selected BorderButton depth
  const buttonWidth = 100; // Original BorderButton width

  // Expanded shape dimensions
  const expandedLeft = isExpanded ? 0 : searchButtonLeft;
  const expandedWidth = isExpanded ? rightButtonsLeft : buttonWidth;

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
      {/* Logo - fades out when search expands past it */}
      <img
        ref={logoRef}
        src={imuendoLogo}
        alt="imuendo"
        draggable={false}
        style={{
          height: 50,
          width: 'auto',
          opacity: isExpanded ? 0 : 1,
          transition: `opacity ${Durations.medium}ms ease-out`,
        }}
      />

      {/* Search BorderButton container */}
      <div
        ref={searchButtonRef}
        style={{
          marginLeft: 10,
          alignSelf: 'flex-start',
          opacity: isExpanded ? 0 : 1,
          transition: `opacity ${Durations.fast}ms ease-out`,
          pointerEvents: isExpanded ? 'none' : 'auto',
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

      {/* Expanding search shape - appears when selected, expands in phase 2 */}
      {isSearchSelected && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: expandedLeft,
            width: expandedWidth,
            height: depth,
            pointerEvents: isExpanded ? 'auto' : 'none',
            transition: `left ${Durations.slow}ms ease-out, width ${Durations.slow}ms ease-out`,
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

          {/* SearchBar inside the expanded shape */}
          <div
            style={{
              position: 'absolute',
              top: searchBarTop,
              left: 20,
              right: 20,
              height: searchBarHeight,
              backgroundColor: '#F1F7F0',
              borderRadius: 30,
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              opacity: isExpanded ? 1 : 0,
              transition: `opacity ${Durations.medium}ms ease-out`,
            }}
          >
            {/* Input field - same typography as content SearchBar */}
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
