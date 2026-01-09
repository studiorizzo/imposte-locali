/**
 * StyledListView - Core ListView with custom scrollbar
 * Exact copy from Flokk's styled_listview.dart
 */

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { ScrollbarListStack } from './ScrollbarListStack';

interface StyledListViewProps {
  itemExtent?: number;
  itemCount: number;
  axis?: 'vertical' | 'horizontal';
  padding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  barSize?: number;
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
  const scrollRef = useRef<HTMLDivElement>(null);

  // From Flokk: contentSize = itemCount * (itemExtent ?? 0.0)
  const contentSize = itemCount * (itemExtent ?? 0);

  return (
    <ScrollbarListStack
      contentSize={contentSize}
      axis={axis}
      scrollRef={scrollRef}
      barSize={barSize}
    >
      {/* ListView.builder equivalent */}
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
          // Hide native scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Render items - equivalent to ListView.builder itemBuilder */}
        {Array.from({ length: itemCount }, (_, index) => (
          <div key={index} style={itemExtent ? { height: itemExtent } : undefined}>
            {itemBuilder(index)}
          </div>
        ))}
      </div>
    </ScrollbarListStack>
  );
}
