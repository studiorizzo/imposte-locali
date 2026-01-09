/**
 * StyledListView - Core ListView with custom scrollbar
 * Rewritten from scratch based on Flokk's styled_listview.dart
 *
 * Uses ManagedScrollbarListStack for automatic scroll element management.
 */

import type { ReactNode } from 'react';
import { ManagedScrollbarListStack } from './ScrollbarListStack';

interface StyledListViewProps {
  /** Fixed height per item (optional, used for scrollbar size calculation) */
  itemExtent?: number;
  /** Number of items in the list */
  itemCount: number;
  /** Scroll direction */
  axis?: 'vertical' | 'horizontal';
  /** Padding inside the scroll container */
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  /** Size of the scrollbar */
  barSize?: number;
  /** Render function for each item */
  itemBuilder: (index: number) => ReactNode;
}

export function StyledListView({
  itemExtent,
  itemCount,
  axis = 'vertical',
  padding,
  barSize = 12,
  itemBuilder,
}: StyledListViewProps) {
  // From Flokk: contentSize = itemCount * (itemExtent ?? 0.0)
  const contentSize = itemExtent ? itemCount * itemExtent : undefined;

  return (
    <ManagedScrollbarListStack
      barSize={barSize}
      axis={axis}
      contentSize={contentSize}
    >
      {(scrollRef) => (
        <div
          ref={scrollRef}
          className="styled-listview-scroll"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'auto',
            paddingTop: padding?.top,
            paddingRight: padding?.right,
            paddingBottom: padding?.bottom,
            paddingLeft: padding?.left,
          }}
        >
          {/* Render items - equivalent to ListView.builder itemBuilder */}
          {Array.from({ length: itemCount }, (_, index) => (
            <div key={index} style={itemExtent ? { height: itemExtent } : undefined}>
              {itemBuilder(index)}
            </div>
          ))}
        </div>
      )}
    </ManagedScrollbarListStack>
  );
}
