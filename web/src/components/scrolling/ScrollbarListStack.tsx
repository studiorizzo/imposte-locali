import type { ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface ScrollbarListStackProps {
  barSize: number;
  axis: 'vertical' | 'horizontal';
  children: ReactNode;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  onScroll: (newScrollTop: number) => void;
  scrollbarPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  handleColor?: string;
  trackColor?: string;
}

/**
 * ScrollbarListStack - Port of Flokk's ScrollbarListStack
 *
 * A Stack that combines:
 * 1. Content (with padding on right for scrollbar space)
 * 2. Custom scrollbar overlay
 *
 * From styled_scrollbar.dart:169-220
 */
export function ScrollbarListStack({
  barSize,
  axis,
  children,
  scrollTop,
  scrollHeight,
  clientHeight,
  onScroll,
  scrollbarPadding = {},
  handleColor,
  trackColor,
}: ScrollbarListStackProps) {
  // Calculate padding for scrollbar space (from Flokk:199-201)
  const contentPadding = {
    paddingRight: axis === 'vertical' ? barSize + Insets.sm : 0,
    paddingBottom: axis === 'horizontal' ? barSize + Insets.sm : 0,
  };

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Content with padding for scrollbar */}
      <div style={{ flex: 1, minHeight: 0, ...contentPadding }}>
        {children}
      </div>

      {/* Scrollbar overlay */}
      <div
        style={{
          position: 'absolute',
          top: scrollbarPadding.top ?? 0,
          right: scrollbarPadding.right ?? 0,
          bottom: scrollbarPadding.bottom ?? 0,
          width: barSize,
        }}
      >
        <StyledScrollbar
          size={barSize}
          axis={axis}
          scrollTop={scrollTop}
          scrollHeight={scrollHeight}
          clientHeight={clientHeight}
          onScroll={onScroll}
          showTrack={true}
          handleColor={handleColor}
          trackColor={trackColor}
        />
      </div>
    </div>
  );
}
