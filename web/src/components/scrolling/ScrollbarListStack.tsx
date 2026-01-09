/**
 * ScrollbarListStack - Stack combining content with scrollbar
 * Based on Flokk's ScrollbarListStack in styled_scrollbar.dart
 */

import type { ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface ScrollbarListStackProps {
  /** Size of the scrollbar (width for vertical, height for horizontal) */
  barSize?: number;
  /** Scroll axis */
  axis?: 'vertical' | 'horizontal';
  /** Child content (usually a scrollable list) */
  children: ReactNode;
  /** Reference to the scrollable element */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Total content size for scrollbar calculation */
  contentSize?: number;
  /** Padding around the scrollbar */
  scrollbarPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Handle color override */
  handleColor?: string;
  /** Track color override */
  trackColor?: string;
}

export function ScrollbarListStack({
  barSize = 12,
  axis = 'vertical',
  children,
  scrollRef,
  contentSize,
  scrollbarPadding = {},
  handleColor,
  trackColor,
}: ScrollbarListStackProps) {
  const isVertical = axis === 'vertical';

  // Padding for the content to make room for scrollbar
  // Flokk: right: barSize + Insets.sm for vertical
  const contentPadding = isVertical
    ? { paddingRight: barSize + Insets.sm }
    : { paddingBottom: barSize + Insets.sm };

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,  // Critical for flex scroll
      }}
    >
      {/* Content with padding for scrollbar */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          ...contentPadding,
        }}
      >
        {children}
      </div>

      {/* Scrollbar overlay */}
      <div
        style={{
          position: 'absolute',
          top: scrollbarPadding.top ?? 0,
          right: scrollbarPadding.right ?? 0,
          bottom: scrollbarPadding.bottom ?? 0,
          left: isVertical ? 'auto' : (scrollbarPadding.left ?? 0),
          width: isVertical ? barSize : 'auto',
          height: isVertical ? 'auto' : barSize,
          pointerEvents: 'none',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <StyledScrollbar
            size={barSize}
            axis={axis}
            scrollRef={scrollRef}
            contentSize={contentSize}
            showTrack={true}
            handleColor={handleColor}
            trackColor={trackColor}
          />
        </div>
      </div>
    </div>
  );
}
