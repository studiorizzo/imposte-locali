import { Colors } from '../theme';
import { Sizes } from '../styles';

type BorderPosition = 'top' | 'left' | 'right' | 'bottom';

interface BorderButtonProps {
  position: BorderPosition;
  icon: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  title?: string;
}

/**
 * BorderButton - Button that sits on the border of sidebar/header
 *
 * Based on the Figma mockup (desktop.svg):
 * - Green (#00A086) protrusion: 100x80 with rounded inner corners (radius 40)
 * - Edge raccords: small convex curves (radius 10) connecting to screen edge
 * - Circular button: 60x60, F1F7F0 background, centered in the green area
 * - Icon: #116D5C
 */
export function BorderButton({ position, icon, onClick, isSelected: _isSelected, title }: BorderButtonProps) {
  const buttonSize = Sizes.buttonHeight; // 60

  // LEFT position - sidebar buttons (Dashboard, Contacts, etc.)
  if (position === 'left') {
    // Total slot: 100px height, green shape 80px wide
    // Edge raccords: 10px at top and bottom
    return (
      <div
        style={{
          position: 'relative',
          width: 100,
          height: 100,
          flexShrink: 0,
        }}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Top edge raccord - convex curve */}
          <path
            d="M0 0C0 5.523 4.477 10 10 10H0V0Z"
            fill={Colors.accent1}
          />
          {/* Main green shape - 80x80 with right side rounded (radius 40) */}
          <path
            d="M0 10H40C62.091 10 80 27.909 80 50C80 72.091 62.091 90 40 90H0V10Z"
            fill={Colors.accent1}
          />
          {/* Bottom edge raccord - convex curve */}
          <path
            d="M10 90C4.477 90 0 94.477 0 100V90H10Z"
            fill={Colors.accent1}
          />
        </svg>

        {/* Circular button - centered at (40, 50) */}
        <button
          onClick={onClick}
          title={title}
          style={{
            position: 'absolute',
            left: 40 - buttonSize / 2,
            top: 50 - buttonSize / 2,
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            backgroundColor: Colors.bg1,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#116D5C',
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          {icon}
        </button>
      </div>
    );
  }

  // TOP position - hamburger menu button
  if (position === 'top') {
    // Total slot: 100px width, green shape 80px tall
    return (
      <div
        style={{
          position: 'relative',
          width: 100,
          height: 100,
          flexShrink: 0,
        }}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Left edge raccord */}
          <path
            d="M0 0C5.523 0 10 4.477 10 10H0V0Z"
            fill={Colors.accent1}
          />
          {/* Main green shape - 80x80 with bottom rounded */}
          <path
            d="M10 0V40C10 62.091 27.909 80 50 80C72.091 80 90 62.091 90 40V0H10Z"
            fill={Colors.accent1}
          />
          {/* Right edge raccord */}
          <path
            d="M100 0C94.477 0 90 4.477 90 10H100V0Z"
            fill={Colors.accent1}
          />
        </svg>

        {/* Circular button - centered at (50, 40) */}
        <button
          onClick={onClick}
          title={title}
          style={{
            position: 'absolute',
            left: 50 - buttonSize / 2,
            top: 40 - buttonSize / 2,
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            backgroundColor: Colors.bg1,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#116D5C',
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          {icon}
        </button>
      </div>
    );
  }

  // BOTTOM position - logout button
  if (position === 'bottom') {
    return (
      <div
        style={{
          position: 'relative',
          width: 100,
          height: 100,
          flexShrink: 0,
        }}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Left edge raccord */}
          <path
            d="M0 100C5.523 100 10 95.523 10 90H0V100Z"
            fill={Colors.accent1}
          />
          {/* Main green shape - with top rounded */}
          <path
            d="M10 100V60C10 37.909 27.909 20 50 20C72.091 20 90 37.909 90 60V100H10Z"
            fill={Colors.accent1}
          />
          {/* Right edge raccord */}
          <path
            d="M100 100C94.477 100 90 95.523 90 90H100V100Z"
            fill={Colors.accent1}
          />
        </svg>

        {/* Circular button - centered at (50, 60) */}
        <button
          onClick={onClick}
          title={title}
          style={{
            position: 'absolute',
            left: 50 - buttonSize / 2,
            top: 60 - buttonSize / 2,
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            backgroundColor: Colors.bg1,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#116D5C',
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          {icon}
        </button>
      </div>
    );
  }

  // RIGHT position - header buttons
  if (position === 'right') {
    return (
      <div
        style={{
          position: 'relative',
          width: 100,
          height: 100,
          flexShrink: 0,
        }}
      >
        <svg
          width={100}
          height={100}
          viewBox="0 0 100 100"
          fill="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          {/* Top edge raccord */}
          <path
            d="M100 0C100 5.523 95.523 10 90 10V0H100Z"
            fill={Colors.accent1}
          />
          {/* Main green shape - with left side rounded */}
          <path
            d="M100 10H60C37.909 10 20 27.909 20 50C20 72.091 37.909 90 60 90H100V10Z"
            fill={Colors.accent1}
          />
          {/* Bottom edge raccord */}
          <path
            d="M90 90C95.523 90 100 94.477 100 100V90H90Z"
            fill={Colors.accent1}
          />
        </svg>

        {/* Circular button - centered at (60, 50) */}
        <button
          onClick={onClick}
          title={title}
          style={{
            position: 'absolute',
            left: 60 - buttonSize / 2,
            top: 50 - buttonSize / 2,
            width: buttonSize,
            height: buttonSize,
            borderRadius: '50%',
            backgroundColor: Colors.bg1,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#116D5C',
            transition: 'filter 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.filter = 'brightness(0.95)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = 'none';
          }}
        >
          {icon}
        </button>
      </div>
    );
  }

  return null;
}
