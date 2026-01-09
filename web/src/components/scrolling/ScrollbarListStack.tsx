/**
 * ScrollbarListStack - Container that overlays a custom scrollbar on content
 * Rewritten from scratch based on Flokk's styled_scrollbar.dart (ScrollbarListStack class)
 *
 * From Flokk:
 * - Uses Stack to overlay scrollbar on content
 * - Content has padding on the scrollbar side (right for vertical, bottom for horizontal)
 * - Scrollbar is positioned at the edge
 */

import { useState, useCallback, type ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface ScrollbarListStackProps {
  /** Size of the scrollbar (width for vertical, height for horizontal) */
  barSize: number;
  /** Scroll direction */
  axis: 'vertical' | 'horizontal';
  /** Content to display (should contain the scrollable element) */
  children: ReactNode;
  /** Optional content size for more accurate scrollbar calculations */
  contentSize?: number;
  /** Handle color override */
  handleColor?: string;
  /** Track color override */
  trackColor?: string;
}

/**
 * Hook to manage scroll element registration.
 * The scrollable content calls setScrollElement when it mounts.
 */
export function useScrollbarListStack() {
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const scrollRef = useCallback((element: HTMLElement | null) => {
    setScrollElement(element);
  }, []);

  return { scrollElement, scrollRef };
}

export function ScrollbarListStack({
  barSize,
  axis,
  children,
  contentSize,
  handleColor,
  trackColor,
}: ScrollbarListStackProps & { scrollElement: HTMLElement | null }) {
  const isVertical = axis === 'vertical';

  // From Flokk: child.padding(right: barSize + Insets.sm for vertical)
  const contentPadding = isVertical
    ? { paddingRight: barSize + Insets.sm }
    : { paddingBottom: barSize + Insets.sm };

  return (
    <div
      style={{
        // Must be column to properly constrain height
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',  // Critical: prevents content from growing container
        ...contentPadding,
      }}
    >
      {/* CONTENT - direct children */}
      {children}

      {/* SCROLLBAR */}
      <StyledScrollbar
        size={barSize}
        axis={axis}
        scrollElement={arguments[0].scrollElement}
        contentSize={contentSize}
        trackColor={trackColor}
        handleColor={handleColor}
        showTrack={true}
      />
    </div>
  );
}

/**
 * Convenience component that combines ScrollbarListStack with scroll element management.
 * Use this when you want a simple setup.
 */
interface ManagedScrollbarListStackProps {
  barSize: number;
  axis: 'vertical' | 'horizontal';
  contentSize?: number;
  handleColor?: string;
  trackColor?: string;
  /** Render function that receives the scrollRef to attach to the scrollable element */
  children: (scrollRef: (element: HTMLElement | null) => void) => ReactNode;
}

export function ManagedScrollbarListStack({
  barSize,
  axis,
  contentSize,
  handleColor,
  trackColor,
  children,
}: ManagedScrollbarListStackProps) {
  const { scrollElement, scrollRef } = useScrollbarListStack();
  const isVertical = axis === 'vertical';

  // From Flokk: child.padding(right: barSize + Insets.sm for vertical)
  const contentPadding = isVertical
    ? { paddingRight: barSize + Insets.sm }
    : { paddingBottom: barSize + Insets.sm };

  return (
    <div
      style={{
        // Must be column to properly constrain height
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        overflow: 'hidden',  // Critical: prevents content from growing container
        ...contentPadding,
      }}
    >
      {/* CONTENT - direct children, no extra wrapper needed */}
      {children(scrollRef)}

      {/* SCROLLBAR */}
      <StyledScrollbar
        size={barSize}
        axis={axis}
        scrollElement={scrollElement}
        contentSize={contentSize}
        trackColor={trackColor}
        handleColor={handleColor}
        showTrack={true}
      />
    </div>
  );
}
