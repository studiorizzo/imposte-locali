import { useRef, useState, useCallback, useEffect } from 'react';
import { Colors } from '../../theme';

interface StyledScrollbarProps {
  size: number;
  axis: 'vertical' | 'horizontal';
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  onScroll: (newScrollTop: number) => void;
  showTrack?: boolean;
  handleColor?: string;
  trackColor?: string;
}

/**
 * StyledScrollbar - Port of Flokk's styled_scrollbar.dart
 *
 * A custom scrollbar that can be positioned as an overlay.
 * Calculates handle size and position based on content/viewport ratio.
 */
export function StyledScrollbar({
  size,
  axis,
  scrollTop,
  scrollHeight,
  clientHeight,
  onScroll,
  showTrack = true,
  handleColor,
  trackColor,
}: StyledScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);

  // Calculate dimensions (from Flokk styled_scrollbar.dart:70-108)
  const viewExtent = clientHeight;
  const maxScrollExtent = scrollHeight - clientHeight;
  const contentExtent = scrollHeight;

  // Hide handle if content fits in viewport
  const showHandle = contentExtent > viewExtent && contentExtent > 0;

  // Calculate handle size: viewport / content ratio, minimum 60px
  let handleExtent = viewExtent;
  if (contentExtent > viewExtent) {
    handleExtent = Math.max(60, (viewExtent * viewExtent) / contentExtent);
  }

  // Calculate handle position (0 to 1)
  const scrollRatio = maxScrollExtent > 0 ? scrollTop / maxScrollExtent : 0;

  // Available space for handle movement
  const trackSpace = viewExtent - handleExtent;
  const handleOffset = trackSpace * scrollRatio;

  // Colors (from Flokk)
  const defaultHandleColor = Colors.greyWeak;
  const defaultTrackColor = `${Colors.greyWeak}4D`; // 30% opacity
  const finalHandleColor = handleColor || defaultHandleColor;
  const finalTrackColor = trackColor || defaultTrackColor;

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = scrollTop;
  }, [scrollTop]);

  // Handle drag move
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - dragStartY.current;
      // Convert pixel movement to scroll position (from Flokk:161-165)
      const pxRatio = contentExtent / viewExtent;
      const newScrollTop = Math.max(
        0,
        Math.min(maxScrollExtent, dragStartScrollTop.current + deltaY * pxRatio)
      );
      onScroll(newScrollTop);
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
  }, [isDragging, contentExtent, viewExtent, maxScrollExtent, onScroll]);

  // Handle track click (jump to position)
  const handleTrackClick = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const clickRatio = clickY / viewExtent;
    const newScrollTop = Math.max(
      0,
      Math.min(maxScrollExtent, clickRatio * maxScrollExtent)
    );
    onScroll(newScrollTop);
  }, [viewExtent, maxScrollExtent, onScroll]);

  if (!showHandle) {
    return null;
  }

  return (
    <div
      ref={trackRef}
      onClick={handleTrackClick}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: axis === 'vertical' ? size : '100%',
        height: axis === 'horizontal' ? size : '100%',
        backgroundColor: showTrack ? finalTrackColor : 'transparent',
        cursor: 'pointer',
      }}
    >
      {/* Handle */}
      <div
        onMouseDown={handleMouseDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: 'absolute',
          top: axis === 'vertical' ? handleOffset : 0,
          left: axis === 'horizontal' ? handleOffset : 0,
          width: axis === 'vertical' ? size : handleExtent,
          height: axis === 'vertical' ? handleExtent : size,
          backgroundColor: finalHandleColor,
          opacity: isHovered || isDragging ? 1 : 0.85,
          borderRadius: 3,
          cursor: isDragging ? 'grabbing' : 'grab',
          transition: isDragging ? 'none' : 'opacity 0.15s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
