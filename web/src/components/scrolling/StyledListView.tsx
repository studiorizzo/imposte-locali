/**
 * StyledListView - Core list view with custom scrollbar
 * Based on Flokk's StyledListView in styled_listview.dart
 *
 * Wraps a scrollable container with ScrollbarListStack
 */

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ScrollbarListStack } from './ScrollbarListStack';

interface StyledListViewProps {
  /** Children to render inside the scrollable area */
  children: ReactNode;
  /** Fixed height for each item (for calculating content size) */
  itemExtent?: number;
  /** Total number of items (for calculating content size) */
  itemCount?: number;
  /** Scroll axis */
  axis?: 'vertical' | 'horizontal';
  /** Padding inside the scrollable area */
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Padding around the scrollbar */
  scrollbarPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Size of the scrollbar */
  barSize?: number;
  /** Handle color override */
  handleColor?: string;
  /** Track color override */
  trackColor?: string;
}

export function StyledListView({
  children,
  itemExtent,
  itemCount,
  axis = 'vertical',
  padding = {},
  scrollbarPadding = {},
  barSize = 12,
  handleColor,
  trackColor,
}: StyledListViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Calculate content size from itemCount * itemExtent (like Flokk)
  const contentSize = itemExtent && itemCount
    ? itemCount * itemExtent
    : undefined;

  return (
    <ScrollbarListStack
      barSize={barSize}
      axis={axis}
      scrollRef={scrollRef}
      contentSize={contentSize}
      scrollbarPadding={scrollbarPadding}
      handleColor={handleColor}
      trackColor={trackColor}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,  // Critical for flex scroll
          overflow: 'auto',
          paddingTop: padding.top,
          paddingRight: padding.right,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left,
        }}
      >
        {children}
      </div>
    </ScrollbarListStack>
  );
}
