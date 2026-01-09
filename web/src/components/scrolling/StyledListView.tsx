/**
 * StyledListView - Scrollable list with custom scrollbar
 * Simplified version
 */

import { useRef } from 'react';
import type { ReactNode } from 'react';
import { StyledScrollbar } from './StyledScrollbar';
import { Insets } from '../../styles';

interface StyledListViewProps {
  children: ReactNode;
  barSize?: number;
}

export function StyledListView({
  children,
  barSize = 12,
}: StyledListViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      style={{
        position: 'relative',
        flex: 1,
        display: 'flex',
        minHeight: 0,
      }}
    >
      {/* Scrollable content with padding for scrollbar */}
      <div
        ref={scrollRef}
        className="styled-listview-scroll"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: 'auto',
          paddingRight: barSize + Insets.sm, // Space for scrollbar
          // Hide native scrollbar
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {children}
      </div>

      {/* Custom scrollbar */}
      <StyledScrollbar scrollRef={scrollRef} size={barSize} />
    </div>
  );
}
