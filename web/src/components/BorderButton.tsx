import { Colors } from '../theme';

type BorderPosition = 'top' | 'left' | 'right' | 'bottom';

interface BorderButtonProps {
  position: BorderPosition;
  icon: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  title?: string;
}

/**
 * BorderButton - Modular button component for sidebar/header borders
 *
 * Structure (single SVG path combining shape + raccords):
 * - Green shape (#00A086): 80x80 with rounded corners (radius 40) toward interior
 * - Convex raccords: radius 10 at screen edge corners
 * - Total size: 100x80 (rest) or 100x100 (selected)
 * - Circular button: 60x60, #F1F7F0 background
 * - Icon: #116D5C
 *
 * The 100px dimension is along the screen edge.
 * The 80px (or 100px when selected) is the depth into the sidebar/header.
 */
export function BorderButton({
  position,
  icon,
  onClick,
  isSelected = false,
  title,
}: BorderButtonProps) {
  const buttonSize = 60;
  const lengthAlongEdge = 100; // Fixed: 100px along the screen edge
  const depthRest = 80;        // Rest state depth
  const depthSelected = 100;   // Selected state depth
  const depth = isSelected ? depthSelected : depthRest;
  const innerRadius = 40;      // Radius of rounded inner corners
  const raccordRadius = 10;    // Radius of edge raccords

  // Bezier control point offset for quarter circle approximation
  const k = 0.5523;

  // Generate the combined SVG path (shape + raccords as ONE element)
  const getPath = () => {
    const r = raccordRadius;
    const kr = r * k;
    const R = innerRadius;
    const kR = R * k;
    const L = lengthAlongEdge;
    const D = depth;
    const centerY = L / 2; // Center of the rounded end

    if (position === 'left') {
      // Shape extends from x=0 (screen edge) to x=D
      // Height is L (100px), centered vertically
      // Rounded end is on the RIGHT side (x=D)
      return `
        M0 0
        C0 ${kr} ${r - kr} ${r} ${r} ${r}
        L${D - R} ${r}
        C${D - R + kR} ${r} ${D} ${centerY - R + r - kR} ${D} ${centerY - R + r}
        L${D} ${centerY + R - r}
        C${D} ${centerY + R - r + kR} ${D - R + kR} ${L - r} ${D - R} ${L - r}
        L${r} ${L - r}
        C${r - kr} ${L - r} 0 ${L - kr} 0 ${L}
        Z
      `;
    }

    if (position === 'right') {
      // Mirror of left: extends from x=D to x=0 (screen edge at x=D in local coords)
      // Rounded end is on the LEFT side (x=0 in local coords)
      return `
        M${D} 0
        C${D} ${kr} ${D - r + kr} ${r} ${D - r} ${r}
        L${R} ${r}
        C${R - kR} ${r} 0 ${centerY - R + r - kR} 0 ${centerY - R + r}
        L0 ${centerY + R - r}
        C0 ${centerY + R - r + kR} ${R - kR} ${L - r} ${R} ${L - r}
        L${D - r} ${L - r}
        C${D - r + kr} ${L - r} ${D} ${L - kr} ${D} ${L}
        Z
      `;
    }

    if (position === 'top') {
      // Shape extends from y=0 (screen edge) to y=D
      // Width is L (100px)
      // Rounded end is on the BOTTOM side (y=D)
      const centerX = L / 2;
      return `
        M0 0
        C${kr} 0 ${r} ${r - kr} ${r} ${r}
        L${r} ${D - R}
        C${r} ${D - R + kR} ${centerX - R + r - kR} ${D} ${centerX - R + r} ${D}
        L${centerX + R - r} ${D}
        C${centerX + R - r + kR} ${D} ${L - r} ${D - R + kR} ${L - r} ${D - R}
        L${L - r} ${r}
        C${L - r} ${r - kr} ${L - kr} 0 ${L} 0
        Z
      `;
    }

    if (position === 'bottom') {
      // Mirror of top: screen edge at y=D (in local coords)
      // Rounded end is on the TOP side (y=0 in local coords)
      const centerX = L / 2;
      return `
        M0 ${D}
        C${kr} ${D} ${r} ${D - r + kr} ${r} ${D - r}
        L${r} ${R}
        C${r} ${R - kR} ${centerX - R + r - kR} 0 ${centerX - R + r} 0
        L${centerX + R - r} 0
        C${centerX + R - r + kR} 0 ${L - r} ${R - kR} ${L - r} ${R}
        L${L - r} ${D - r}
        C${L - r} ${D - r + kr} ${L - kr} ${D} ${L} ${D}
        Z
      `;
    }

    return '';
  };

  // Calculate button center position
  const getButtonCenter = () => {
    const centerAlongEdge = lengthAlongEdge / 2; // 50
    const centerDepth = depth / 2;               // 40 or 50

    if (position === 'left') {
      return { x: centerDepth, y: centerAlongEdge };
    }
    if (position === 'right') {
      return { x: centerDepth, y: centerAlongEdge };
    }
    if (position === 'top') {
      return { x: centerAlongEdge, y: centerDepth };
    }
    if (position === 'bottom') {
      return { x: centerAlongEdge, y: centerDepth };
    }
    return { x: 0, y: 0 };
  };

  // Get container dimensions based on position
  const getContainerSize = () => {
    if (position === 'left' || position === 'right') {
      return { width: depth, height: lengthAlongEdge };
    }
    return { width: lengthAlongEdge, height: depth };
  };

  const containerSize = getContainerSize();
  const buttonCenter = getButtonCenter();

  return (
    <div
      style={{
        position: 'relative',
        width: containerSize.width,
        height: containerSize.height,
        flexShrink: 0,
      }}
    >
      {/* Green shape with integrated raccords - single SVG path */}
      <svg
        width={containerSize.width}
        height={containerSize.height}
        viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          d={getPath()}
          fill={Colors.accent1}
        />
      </svg>

      {/* Circular button */}
      <button
        onClick={onClick}
        title={title}
        style={{
          position: 'absolute',
          left: buttonCenter.x - buttonSize / 2,
          top: buttonCenter.y - buttonSize / 2,
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
