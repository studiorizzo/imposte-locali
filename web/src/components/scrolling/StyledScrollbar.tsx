/**
 * StyledScrollbar - Custom scrollbar component
 * Simplified version that works reliably
 */

import { useState, useEffect, useCallback } from 'react';
import { Colors } from '../../theme';

interface StyledScrollbarProps {
  /** Reference to the scrollable element */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Size of the scrollbar */
  size?: number;
}

export function StyledScrollbar({
  scrollRef,
  size = 12,
}: StyledScrollbarProps) {
  const [scrollInfo, setScrollInfo] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScrollTop, setDragStartScrollTop] = useState(0);

  // Sync with scroll element
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = () => {
      setScrollInfo({
        scrollTop: el.scrollTop,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
      });
    };

    update();
    el.addEventListener('scroll', update);

    const observer = new ResizeObserver(update);
    observer.observe(el);

    // Also observe content changes
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(el, { childList: true, subtree: true });

    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [scrollRef]);

  const { scrollTop, scrollHeight, clientHeight } = scrollInfo;
  const maxScroll = scrollHeight - clientHeight;
  const canScroll = maxScroll > 0;

  // Calculate handle size and position
  const trackHeight = clientHeight;
  const handleHeight = canScroll
    ? Math.max(40, (clientHeight / scrollHeight) * trackHeight)
    : trackHeight;
  const handleTop = canScroll
    ? (scrollTop / maxScroll) * (trackHeight - handleHeight)
    : 0;

  // Handle drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartScrollTop(scrollRef.current?.scrollTop || 0);
  }, [scrollRef]);

  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e: MouseEvent) => {
      const el = scrollRef.current;
      if (!el) return;

      const deltaY = e.clientY - dragStartY;
      const scrollRatio = maxScroll / (trackHeight - handleHeight);
      el.scrollTop = Math.max(0, Math.min(maxScroll, dragStartScrollTop + deltaY * scrollRatio));
    };

    const onMouseUp = () => setIsDragging(false);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, dragStartY, dragStartScrollTop, maxScroll, trackHeight, handleHeight, scrollRef]);

  // Track click
  const onTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return; // Only track clicks, not handle
    const el = scrollRef.current;
    if (!el) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const targetScroll = (clickY / trackHeight) * scrollHeight - clientHeight / 2;
    el.scrollTop = Math.max(0, Math.min(maxScroll, targetScroll));
  }, [scrollRef, trackHeight, scrollHeight, clientHeight, maxScroll]);

  // Always render the track, hide handle if not scrollable
  return (
    <div
      onClick={onTrackClick}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: size,
        backgroundColor: `${Colors.greyWeak}4D`,
        cursor: 'pointer',
      }}
    >
      {canScroll && (
        <div
          onMouseDown={onMouseDown}
          style={{
            position: 'absolute',
            top: handleTop,
            left: 0,
            right: 0,
            height: handleHeight,
            backgroundColor: Colors.greyWeak,
            borderRadius: 3,
            cursor: 'grab',
            opacity: isDragging ? 1 : 0.85,
          }}
        />
      )}
    </div>
  );
}
