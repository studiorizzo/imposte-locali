/**
 * StyledScrollbar - Custom scrollbar component
 * Rewritten from scratch based on Flokk's styled_scrollbar.dart
 *
 * Key concepts from Flokk:
 * - Uses LayoutBuilder to get container dimensions (viewExtent)
 * - Uses ScrollController for scroll position and maxScrollExtent
 * - handleAlignment converts from [0,1] to [-1,1] range
 * - handleExtent = max(60, viewExtent² / contentExtent)
 * - pxRatio for drag = (maxScrollExtent + viewExtent) / viewExtent
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Colors } from '../../theme';
import { Sizes } from '../../styles';

interface StyledScrollbarProps {
  /** Width/height of the scrollbar track */
  size: number;
  /** Scroll direction */
  axis: 'vertical' | 'horizontal';
  /** Reference to the scrollable element */
  scrollElement: HTMLElement | null;
  /** Callback when dragging */
  onDrag?: (delta: number) => void;
  /** Show track background */
  showTrack?: boolean;
  /** Handle color override */
  handleColor?: string;
  /** Track color override */
  trackColor?: string;
  /** Optional content size for more accurate calculations */
  contentSize?: number;
}

export function StyledScrollbar({
  size,
  axis,
  scrollElement,
  onDrag,
  showTrack = false,
  handleColor,
  trackColor,
  contentSize,
}: StyledScrollbarProps) {
  // State for scrollbar calculations
  const [viewExtent, setViewExtent] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [maxScrollExtent, setMaxScrollExtent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Reference to the scrollbar container (for measuring viewExtent like LayoutBuilder)
  const containerRef = useRef<HTMLDivElement>(null);

  const isVertical = axis === 'vertical';

  // Measure container size (equivalent to Flutter's LayoutBuilder constraints)
  // This gives us viewExtent - the visible area of the scrollbar
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measureContainer = () => {
      const rect = container.getBoundingClientRect();
      setViewExtent(isVertical ? rect.height : rect.width);
    };

    measureContainer();

    const resizeObserver = new ResizeObserver(measureContainer);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [isVertical]);

  // Sync with scroll element (equivalent to Flutter's ScrollController listener)
  useEffect(() => {
    if (!scrollElement) return;

    const updateScrollState = () => {
      const scrollPos = isVertical ? scrollElement.scrollTop : scrollElement.scrollLeft;
      const scrollMax = isVertical
        ? scrollElement.scrollHeight - scrollElement.clientHeight
        : scrollElement.scrollWidth - scrollElement.clientWidth;

      setScrollOffset(scrollPos);
      setMaxScrollExtent(scrollMax);
    };

    // Initial measurement
    updateScrollState();

    // Listen to scroll events
    scrollElement.addEventListener('scroll', updateScrollState);

    // Listen to content size changes
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [scrollElement, isVertical]);

  // Calculate maxExtent (from Flokk build method)
  // Use provided contentSize if available, otherwise use DOM measurement
  const maxExtent = (contentSize != null && contentSize > 0)
    ? contentSize - viewExtent
    : maxScrollExtent;

  // contentExtent = total scrollable area
  const contentExtent = maxExtent + viewExtent;

  // showHandle - from Flokk: contentExtent > viewExtent && contentExtent > 0
  const showHandle = contentExtent > viewExtent && contentExtent > 0;

  // handleAlignment: convert scroll position from [0,1] to [-1,1] range
  // From Flokk: handleAlignment = (offset / maxExtent) * 2 - 1
  let handleAlignment = maxExtent === 0 ? 0 : scrollOffset / maxExtent;
  handleAlignment = handleAlignment * 2.0 - 1.0;
  // Clamp to valid range
  handleAlignment = Math.max(-1, Math.min(1, handleAlignment));

  // handleExtent - from Flokk: max(60, viewExtent * viewExtent / contentExtent)
  let handleExtent = viewExtent;
  if (contentExtent > viewExtent) {
    handleExtent = Math.max(60, (viewExtent * viewExtent) / contentExtent);
  }

  // Convert handleAlignment [-1, 1] to pixel position
  // Flutter's Alignment: -1 = start, 1 = end
  // Position = ((alignment + 1) / 2) * (viewExtent - handleExtent)
  const handlePosition = ((handleAlignment + 1) / 2) * (viewExtent - handleExtent);

  // Colors from Flokk theme
  const finalHandleColor = handleColor ?? Colors.greyWeak;
  const finalTrackColor = trackColor ?? `${Colors.greyWeak}4D`; // 30% opacity

  // Drag handler - from Flokk _handleVerticalDrag / _handleHorizontalDrag
  const handleDrag = useCallback((e: MouseEvent, startPos: number, startOffset: number) => {
    if (!scrollElement) return;

    const currentPos = isVertical ? e.clientY : e.clientX;
    const delta = currentPos - startPos;

    // pxRatio from Flokk: (maxScrollExtent + viewExtent) / viewExtent
    const currentMaxExtent = isVertical
      ? scrollElement.scrollHeight - scrollElement.clientHeight
      : scrollElement.scrollWidth - scrollElement.clientWidth;
    const currentViewExtent = isVertical
      ? scrollElement.clientHeight
      : scrollElement.clientWidth;
    const pxRatio = (currentMaxExtent + currentViewExtent) / currentViewExtent;

    // jumpTo((pos + delta * pxRatio).clamp(0, maxScrollExtent))
    const newScroll = Math.max(0, Math.min(currentMaxExtent, startOffset + delta * pxRatio));

    if (isVertical) {
      scrollElement.scrollTop = newScroll;
    } else {
      scrollElement.scrollLeft = newScroll;
    }

    onDrag?.(delta);
  }, [scrollElement, isVertical, onDrag]);

  // Mouse down handler to start drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!scrollElement) return;

    const startPos = isVertical ? e.clientY : e.clientX;
    const startOffset = isVertical ? scrollElement.scrollTop : scrollElement.scrollLeft;

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleDrag(moveEvent, startPos, startOffset);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [scrollElement, isVertical, handleDrag]);

  return (
    <div
      ref={containerRef}
      style={{
        // Fill entire container - like Flutter's Stack child
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: isVertical ? 'auto' : 0,
        width: isVertical ? size : '100%',
        height: isVertical ? '100%' : size,
        // Visibility control from Flokk: .opacity(showHandle ? 1.0 : 0.0)
        opacity: showHandle ? 1 : 0,
        pointerEvents: showHandle ? 'auto' : 'none',
        transition: 'opacity 150ms ease-in-out',
      }}
    >
      {/* TRACK - from Flokk: Align(alignment: Alignment(1, 1), Container...) */}
      {showTrack && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: isVertical ? 'auto' : 0,
            width: isVertical ? size : '100%',
            height: isVertical ? '100%' : size,
            backgroundColor: finalTrackColor,
          }}
        />
      )}

      {/* HANDLE - from Flokk: Align + GestureDetector + MouseHoverBuilder + Container */}
      <div
        onMouseDown={onMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          // Position based on alignment calculation
          [isVertical ? 'top' : 'left']: handlePosition,
          [isVertical ? 'right' : 'bottom']: 0,
          // Size from Flokk
          width: isVertical ? size : handleExtent,
          height: isVertical ? handleExtent : size,
          // Style from Flokk
          backgroundColor: finalHandleColor,
          opacity: isHovered ? 1 : 0.85,
          borderRadius: Sizes.radiusSm,
          cursor: 'pointer',
          transition: 'opacity 100ms ease-in-out',
        }}
      />
    </div>
  );
}
