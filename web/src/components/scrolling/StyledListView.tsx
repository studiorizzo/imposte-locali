import { useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface StyledListViewProps {
  itemExtent: number;
  itemCount: number;
  itemBuilder: (index: number) => ReactNode;
  axis?: 'vertical' | 'horizontal';
  barSize?: number;
  scrollbarPadding?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

/**
 * StyledListView - Port of Flokk's styled_listview.dart
 *
 * Core ListView for the app.
 * Wraps a scrollable container + StyledScrollbar and calculates content size
 * from itemCount * itemExtent for accurate scrollbar sizing.
 *
 * From styled_listview.dart:18-90
 */
export function StyledListView({
  itemExtent,
  itemCount,
  itemBuilder,
  axis = 'vertical',
  barSize = 12,
  scrollbarPadding = {},
}: StyledListViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);

  // Calculate content size (from Flokk styled_listview.dart:71)
  const contentSize = itemCount * itemExtent;

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setScrollTop(scrollRef.current.scrollTop);
      setClientHeight(scrollRef.current.clientHeight);
    }
  }, []);

  // Handle scrollbar drag
  const handleScrollbarScroll = useCallback((newScrollTop: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = newScrollTop;
    }
  }, []);

  // Update clientHeight on mount and resize
  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      (scrollRef as React.MutableRefObject<HTMLDivElement>).current = node;
      setClientHeight(node.clientHeight);

      // Set up ResizeObserver for clientHeight changes
      const resizeObserver = new ResizeObserver(() => {
        setClientHeight(node.clientHeight);
      });
      resizeObserver.observe(node);
    }
  }, []);

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Scrollable content with padding for scrollbar */}
      <div
        ref={handleRef}
        onScroll={handleScroll}
        className="styled-listview-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: axis === 'vertical' ? 'scroll' : 'hidden',
          overflowX: axis === 'horizontal' ? 'scroll' : 'hidden',
          paddingRight: axis === 'vertical' ? barSize + Insets.sm : 0,
          paddingBottom: axis === 'horizontal' ? barSize + Insets.sm : 0,
        }}
      >
        {Array.from({ length: itemCount }, (_, index) => (
          <div key={index} style={{ height: itemExtent }}>
            {itemBuilder(index)}
          </div>
        ))}
      </div>

      {/* Custom scrollbar overlay */}
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
          scrollHeight={contentSize}
          clientHeight={clientHeight}
          onScroll={handleScrollbarScroll}
          showTrack={true}
        />
      </div>
    </div>
  );
}
