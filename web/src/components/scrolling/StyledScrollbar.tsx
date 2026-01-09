/**
 * StyledScrollbar - Custom scrollbar component
 * Exact copy from Flokk's styled_scrollbar.dart
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { Colors } from '../../theme';
import { Sizes } from '../../styles';

interface StyledScrollbarProps {
  size: number;
  axis: 'vertical' | 'horizontal';
  scrollRef: React.RefObject<HTMLElement | null>;
  onDrag?: (delta: number) => void;
  showTrack?: boolean;
  handleColor?: string;
  trackColor?: string;
  contentSize?: number;
}

export function StyledScrollbar({
  size,
  axis,
  scrollRef,
  onDrag,
  showTrack = false,
  handleColor,
  trackColor,
  contentSize,
}: StyledScrollbarProps) {
  const [viewExtent, setViewExtent] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [maxScrollExtent, setMaxScrollExtent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get viewExtent from scrollbar container - like Flokk's LayoutBuilder
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateContainerSize = () => {
      const isVertical = axis === 'vertical';
      setViewExtent(isVertical ? container.clientHeight : container.clientWidth);
    };

    updateContainerSize();
    const resizeObserver = new ResizeObserver(updateContainerSize);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, [axis]);

  // Sync scroll position with scroll element
  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const updateScrollState = () => {
      const isVertical = axis === 'vertical';
      setScrollOffset(isVertical ? element.scrollTop : element.scrollLeft);
      setMaxScrollExtent(
        isVertical
          ? element.scrollHeight - element.clientHeight
          : element.scrollWidth - element.clientWidth
      );
    };

    updateScrollState();
    element.addEventListener('scroll', updateScrollState);

    // Also observe scroll element for content changes
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener('scroll', updateScrollState);
      resizeObserver.disconnect();
    };
  }, [scrollRef, axis]);

  // Calculate maxExtent - from Flokk build() method
  const maxExtent = (contentSize != null && contentSize > 0)
    ? contentSize - viewExtent
    : maxScrollExtent;

  // contentExtent = maxExtent + viewExtent
  const contentExtent = maxExtent + viewExtent;

  // showHandle - use maxScrollExtent from DOM as it's more reliable
  // maxScrollExtent > 0 means there's content to scroll
  const showHandle = maxScrollExtent > 0 || (contentSize != null && contentSize > viewExtent && viewExtent > 0);

  // handleAlignment from [0,1] to [-1,1] - from Flokk
  let handleAlignment = maxExtent === 0 ? 0 : scrollOffset / maxExtent;
  handleAlignment *= 2.0;
  handleAlignment -= 1.0;

  // handleExtent - from Flokk: max(60, viewExtent * viewExtent / contentExtent)
  let handleExtent = viewExtent;
  if (contentExtent > viewExtent) {
    handleExtent = Math.max(60, (viewExtent * viewExtent) / contentExtent);
  }

  // Colors - from Flokk theme
  const finalHandleColor = handleColor ?? Colors.greyWeak;
  const finalTrackColor = trackColor ?? `${Colors.greyWeak}4D`; // 30% opacity

  // Drag handlers - exact copy from Flokk _handleVerticalDrag / _handleHorizontalDrag
  const handleDrag = useCallback((e: MouseEvent, startY: number, startX: number, startOffset: number) => {
    const element = scrollRef.current;
    if (!element) return;

    const isVertical = axis === 'vertical';
    const delta = isVertical ? e.clientY - startY : e.clientX - startX;

    // pxRatio = (maxScrollExtent + viewExtent) / viewExtent - from Flokk
    const currentMaxExtent = isVertical
      ? element.scrollHeight - element.clientHeight
      : element.scrollWidth - element.clientWidth;
    const currentViewExtent = isVertical ? element.clientHeight : element.clientWidth;
    const pxRatio = (currentMaxExtent + currentViewExtent) / currentViewExtent;

    // jumpTo((pos + delta * pxRatio).clamp(0, maxScrollExtent)) - from Flokk
    const newScroll = Math.max(0, Math.min(currentMaxExtent, startOffset + delta * pxRatio));

    if (isVertical) {
      element.scrollTop = newScroll;
    } else {
      element.scrollLeft = newScroll;
    }

    onDrag?.(delta);
  }, [axis, scrollRef, onDrag]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startX = e.clientX;
    const startOffset = axis === 'vertical'
      ? scrollRef.current?.scrollTop ?? 0
      : scrollRef.current?.scrollLeft ?? 0;

    const onMouseMove = (moveEvent: MouseEvent) => {
      handleDrag(moveEvent, startY, startX, startOffset);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [axis, scrollRef, handleDrag]);

  const isVertical = axis === 'vertical';

  // Convert handleAlignment [-1, 1] to top position
  // In Flutter Alignment, -1 is top, 1 is bottom
  // Position = ((alignment + 1) / 2) * (viewExtent - handleExtent)
  const handlePosition = ((handleAlignment + 1) / 2) * (viewExtent - handleExtent);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: isVertical ? 'auto' : 0,
        width: isVertical ? size : '100%',
        height: isVertical ? '100%' : size,
        opacity: showHandle ? 1 : 0,
        pointerEvents: showHandle ? 'auto' : 'none',
        zIndex: 10, // Ensure scrollbar is above content
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
          [isVertical ? 'top' : 'left']: handlePosition,
          [isVertical ? 'right' : 'bottom']: 0,
          width: isVertical ? size : handleExtent,
          height: isVertical ? handleExtent : size,
          backgroundColor: finalHandleColor,
          opacity: isHovered ? 1 : 0.85,
          borderRadius: Sizes.radiusSm, // Corners.s3Border = 3px
          cursor: 'pointer',
        }}
      />
    </div>
  );
}
