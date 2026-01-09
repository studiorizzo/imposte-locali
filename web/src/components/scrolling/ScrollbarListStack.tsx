/**
 * ScrollbarListStack - Stack with scrollbar overlay
 * Exact copy from Flokk's styled_scrollbar.dart (ScrollbarListStack class)
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

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* LIST - from Flokk: child.padding(...) */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', ...contentPadding }}>
        {children}
      </div>

      {/* SCROLLBAR - from Flokk: Padding + StyledScrollbar */}
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
  );
}
