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

export function Header({ onCreateContribuente, onOpenImmobileForm, isSearchSelected, onSearchToggle }: HeaderProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const rightButtonsRef = useRef<HTMLDivElement>(null);
  const [rightButtonsLeft, setRightButtonsLeft] = useState(0);

  // Measure right buttons position
  useEffect(() => {
    const updatePosition = () => {
      if (rightButtonsRef.current) {
        const rect = rightButtonsRef.current.getBoundingClientRect();
        const headerRect = rightButtonsRef.current.parentElement?.getBoundingClientRect();
        if (headerRect) {
          setRightButtonsLeft(rect.left - headerRect.left);
        }
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  // Phase 2: Expand after BorderButton extends
  useEffect(() => {
    if (isSearchSelected) {
      // Wait for BorderButton extension animation (300ms) then expand
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
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isExpanded]);

  // Calculate positions
  // Logo: paddingLeft 10px, logo ~100px wide
  // Search button starts at: 10 + logoWidth + 10 = ~120px
  const searchButtonLeft = 120; // approximate initial position
  const expandedRight = rightButtonsLeft > 0 ? rightButtonsLeft : 200; // where user_add starts

  return (
    <header
      className="flex items-center relative"
      style={{
        backgroundColor: Colors.bg1,
        height: Sizes.headerHeight,
        paddingLeft: 10,
      }}
    >
      {/* Logo - fades out when search expands */}
      <img
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

      {/* Search BorderButton - visible when not expanded */}
      <div
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

      {/* Expanded Search Bar - appears after BorderButton extends */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: Sizes.headerHeight,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 20,
          paddingRight: 20,
          // Animate width expansion
          width: isExpanded ? expandedRight : 100,
          opacity: isSearchSelected ? 1 : 0,
          pointerEvents: isExpanded ? 'auto' : 'none',
          overflow: 'hidden',
          transition: `width ${Durations.slow}ms ease-out, opacity ${Durations.fast}ms ease-out`,
        }}
      >
        {/* Search input container - pill shape */}
        <div
          style={{
            width: '100%',
            height: 60,
            backgroundColor: Colors.accent1,
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 20,
            paddingRight: 20,
            opacity: isExpanded ? 1 : 0,
            transform: isExpanded ? 'scale(1)' : 'scale(0.95)',
            transition: `opacity ${Durations.medium}ms ease-out, transform ${Durations.medium}ms ease-out`,
          }}
        >
          {/* Search icon */}
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={Colors.surface}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>

          {/* Input field */}
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca contribuenti..."
            style={{
              flex: 1,
              height: '100%',
              marginLeft: 12,
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: Fonts.primary,
              fontSize: 16,
              color: Colors.surface,
            }}
          />

          {/* Clear button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width={20}
                height={20}
                viewBox="0 0 24 24"
                fill="none"
                stroke={Colors.surface}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Right side BorderButtons - positioned absolute */}
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
