/**
 * StyledScrollbar - Custom scrollbar component
 * Based on Flokk's styled_scrollbar.dart
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Colors } from '../../theme';
import { Sizes } from '../../styles';

interface StyledScrollbarProps {
  /** Width/height of the scrollbar */
  size?: number;
  /** Scroll axis */
  axis?: 'vertical' | 'horizontal';
  /** Reference to the scrollable element */
  scrollRef: React.RefObject<HTMLElement | null>;
  /** Total content size (for calculating handle size) */
  contentSize?: number;
  /** Show the track background */
  showTrack?: boolean;
  /** Handle color override */
  handleColor?: string;
  /** Track color override */
  trackColor?: string;
}

export function StyledScrollbar({
  size = 12,
  axis = 'vertical',
  scrollRef,
  contentSize,
  showTrack = true,
  handleColor,
  trackColor,
}: StyledScrollbarProps) {
  const [scrollState, setScrollState] = useState({
    scrollOffset: 0,
    scrollMax: 0,
    viewExtent: 0,
  });
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ y: 0, x: 0, scrollOffset: 0 });

  // Update scroll state when scrollable element scrolls
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateScrollState = () => {
      const isVertical = axis === 'vertical';
      setScrollState({
        scrollOffset: isVertical ? element.scrollTop : element.scrollLeft,
        scrollMax: isVertical
          ? element.scrollHeight - element.clientHeight
          : element.scrollWidth - element.clientWidth,
        viewExtent: isVertical ? element.clientHeight : element.clientWidth,
      });
    };

    updateScrollState();
    element.addEventListener('scroll', updateScrollState);

    // Also update on resize
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [scrollRef, axis]);

  // Calculate handle size and position
  const { scrollOffset, scrollMax, viewExtent } = scrollState;
  const totalContent = contentSize || (scrollMax + viewExtent);

  // Handle extent: proportional to viewport/content ratio, min 60px
  let handleExtent = viewExtent;
  if (totalContent > viewExtent) {
    handleExtent = Math.max(60, (viewExtent * viewExtent) / totalContent);
  }

  // Handle position: 0 to (viewExtent - handleExtent)
  const handlePosition = scrollMax > 0
    ? (scrollOffset / scrollMax) * (viewExtent - handleExtent)
    : 0;

  // Hide scrollbar if content fits in viewport
  const showHandle = totalContent > viewExtent && totalContent > 0;

  // Colors from Flokk theme
  const finalHandleColor = handleColor || Colors.greyWeak;
  const finalTrackColor = trackColor || `${Colors.greyWeak}4D`; // 30% opacity

  // Drag handling
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      y: e.clientY,
      x: e.clientX,
      scrollOffset: axis === 'vertical'
        ? scrollRef.current?.scrollTop || 0
        : scrollRef.current?.scrollLeft || 0,
    };
  }, [axis, scrollRef]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const element = scrollRef.current;
      if (!element) return;

      const delta = axis === 'vertical'
        ? e.clientY - dragStartRef.current.y
        : e.clientX - dragStartRef.current.x;

      // Convert pixel delta to scroll delta
      const scrollableRange = viewExtent - handleExtent;
      const scrollRatio = scrollMax / scrollableRange;
      const newScroll = dragStartRef.current.scrollOffset + delta * scrollRatio;

      if (axis === 'vertical') {
        element.scrollTop = Math.max(0, Math.min(scrollMax, newScroll));
      } else {
        element.scrollLeft = Math.max(0, Math.min(scrollMax, newScroll));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, axis, scrollRef, scrollMax, viewExtent, handleExtent]);

  // Track click to jump to position
  const handleTrackClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const element = scrollRef.current;
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickPos = axis === 'vertical'
      ? e.clientY - rect.top
      : e.clientX - rect.left;

    // Calculate target scroll position (center handle on click)
    const targetHandlePos = clickPos - handleExtent / 2;
    const scrollableRange = viewExtent - handleExtent;
    const scrollRatio = targetHandlePos / scrollableRange;
    const newScroll = scrollRatio * scrollMax;

    if (axis === 'vertical') {
      element.scrollTop = Math.max(0, Math.min(scrollMax, newScroll));
    } else {
      element.scrollLeft = Math.max(0, Math.min(scrollMax, newScroll));
    }
  }, [axis, scrollRef, scrollMax, viewExtent, handleExtent]);

  const isVertical = axis === 'vertical';

  return (
    <div
      style={{
        position: 'absolute',
        [isVertical ? 'right' : 'bottom']: 0,
        [isVertical ? 'top' : 'left']: 0,
        [isVertical ? 'bottom' : 'right']: 0,
        [isVertical ? 'width' : 'height']: size,
        opacity: showHandle ? 1 : 0,
        transition: 'opacity 150ms ease-out',
        pointerEvents: showHandle ? 'auto' : 'none',
      }}
      onClick={handleTrackClick}
    >
      {/* Track */}
      {showTrack && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: finalTrackColor,
          }}
        />
      )}

      {/* Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          [isVertical ? 'top' : 'left']: handlePosition,
          [isVertical ? 'left' : 'top']: 0,
          [isVertical ? 'right' : 'bottom']: 0,
          [isVertical ? 'height' : 'width']: handleExtent,
          backgroundColor: finalHandleColor,
          opacity: isHovered || isDragging ? 1 : 0.85,
          borderRadius: Sizes.radiusSm / 2, // Corners.s3 = 3px
          cursor: 'pointer',
          transition: 'opacity 150ms ease-out',
        }}
      />
    </div>
  );
}
