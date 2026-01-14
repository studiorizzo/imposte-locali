import { Colors } from '../theme';

type BorderPosition = 'top' | 'left' | 'right' | 'bottom';

interface BorderButtonProps {
  position: BorderPosition;
  icon: React.ReactNode | null;
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
  // NEW DESIGN: Rectangular shape with:
  // - r=10 convex raccords at screen edge corners (create bg1 space)
  // - R=40 concave raccords at internal corners (round the rectangle)
  const getPath = () => {
    const r = raccordRadius;  // 10
    const kr = r * k;
    const R = innerRadius;    // 40
    const kR = R * k;
    const L = lengthAlongEdge; // 100
    const D = depth;          // 80 or 100

    // Calculate if right edge exists (when r+R < L/2)
    const rightEdgeLength = L - 2 * r - 2 * R; // With r=10, R=40, L=100: 100-20-80=0

    if (position === 'left') {
      // Rectangle from (0,0) to (D, L)
      // Screen edge (left): convex raccords at corners
      // Internal edge (right): concave raccords (rounded corners)

      if (rightEdgeLength > 0) {
        // There's a straight right edge
        return `
          M0 0
          C0 ${kr} ${r - kr} ${r} ${r} ${r}
          L${D - R} ${r}
          C${D - R + kR} ${r} ${D} ${r + R - kR} ${D} ${r + R}
          L${D} ${L - r - R}
          C${D} ${L - r - R + kR} ${D - R + kR} ${L - r} ${D - R} ${L - r}
          L${r} ${L - r}
          C${r - kr} ${L - r} 0 ${L - kr} 0 ${L}
          Z
        `;
      } else {
        // Internal corners meet at center (no straight right edge)
        const midY = L / 2;
        return `
          M0 0
          C0 ${kr} ${r - kr} ${r} ${r} ${r}
          L${D - R} ${r}
          C${D - R + kR} ${r} ${D} ${midY - kR} ${D} ${midY}
          C${D} ${midY + kR} ${D - R + kR} ${L - r} ${D - R} ${L - r}
          L${r} ${L - r}
          C${r - kr} ${L - r} 0 ${L - kr} 0 ${L}
          Z
        `;
      }
    }

    if (position === 'right') {
      // Mirror of left
      if (rightEdgeLength > 0) {
        return `
          M${D} 0
          C${D} ${kr} ${D - r + kr} ${r} ${D - r} ${r}
          L${R} ${r}
          C${R - kR} ${r} 0 ${r + R - kR} 0 ${r + R}
          L0 ${L - r - R}
          C0 ${L - r - R + kR} ${R - kR} ${L - r} ${R} ${L - r}
          L${D - r} ${L - r}
          C${D - r + kr} ${L - r} ${D} ${L - kr} ${D} ${L}
          Z
        `;
      } else {
        const midY = L / 2;
        return `
          M${D} 0
          C${D} ${kr} ${D - r + kr} ${r} ${D - r} ${r}
          L${R} ${r}
          C${R - kR} ${r} 0 ${midY - kR} 0 ${midY}
          C0 ${midY + kR} ${R - kR} ${L - r} ${R} ${L - r}
          L${D - r} ${L - r}
          C${D - r + kr} ${L - r} ${D} ${L - kr} ${D} ${L}
          Z
        `;
      }
    }

    if (position === 'top') {
      // Rectangle from (0,0) to (L, D)
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

    if (position === 'bottom') {
      // Mirror of top
      const topEdgeLength = L - 2 * r - 2 * R;

      if (topEdgeLength > 0) {
        return `
          M0 ${D}
          C${kr} ${D} ${r} ${D - r + kr} ${r} ${D - r}
          L${r} ${R}
          C${r} ${R - kR} ${r + R - kR} 0 ${r + R} 0
          L${L - r - R} 0
          C${L - r - R + kR} 0 ${L - r} ${R - kR} ${L - r} ${R}
          L${L - r} ${D - r}
          C${L - r} ${D - r + kr} ${L - kr} ${D} ${L} ${D}
          Z
        `;
      } else {
        const midX = L / 2;
        return `
          M0 ${D}
          C${kr} ${D} ${r} ${D - r + kr} ${r} ${D - r}
          L${r} ${R}
          C${r} ${R - kR} ${midX - kR} 0 ${midX} 0
          C${midX + kR} 0 ${L - r} ${R - kR} ${L - r} ${R}
          L${L - r} ${D - r}
          C${L - r} ${D - r + kr} ${L - kr} ${D} ${L} ${D}
          Z
        `;
      }
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
