/**
 * ScrollbarListStack - Stack with scrollbar overlay
 * Exact copy from Flokk's styled_scrollbar.dart (ScrollbarListStack class)
 * Uses CSS Grid to create true Stack-like behavior where children overlap
 */

import type { ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface ScrollbarListStackProps {
  barSize: number;
  axis: 'vertical' | 'horizontal';
  children: ReactNode;
  scrollRef: React.RefObject<HTMLElement | null>;
  contentSize?: number;
  handleColor?: string;
  trackColor?: string;
}

export function ScrollbarListStack({
  barSize,
  axis,
  children,
  scrollRef,
  contentSize,
  handleColor,
  trackColor,
}: ScrollbarListStackProps) {
  const isVertical = axis === 'vertical';

  // From Flokk: child.padding(right: barSize + Insets.sm for vertical)
  const contentPadding = isVertical
    ? { paddingRight: barSize + Insets.sm }
    : { paddingBottom: barSize + Insets.sm };

  // Use CSS Grid to create Stack-like behavior (both children in same grid cell)
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: '1fr',
        flex: 1,
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {/* LIST - occupies grid cell 1/1, from Flokk: child.padding(...) */}
      <div
        style={{
          gridColumn: '1 / -1',
          gridRow: '1 / -1',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          minWidth: 0,
          ...contentPadding,
        }}
      >
        {children}
      </div>

      {/* SCROLLBAR - occupies same grid cell, overlays content */}
      <div
        style={{
          gridColumn: '1 / -1',
          gridRow: '1 / -1',
          position: 'relative',
          pointerEvents: 'none', // Let clicks through to content
        }}
      >
        <StyledScrollbar
          size={barSize}
          axis={axis}
          scrollRef={scrollRef}
          contentSize={contentSize}
          trackColor={trackColor}
          handleColor={handleColor}
          showTrack={true}
        />
      </div>
    </div>
  );
}
