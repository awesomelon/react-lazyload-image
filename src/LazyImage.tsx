import React, { useEffect, useRef, useState, memo } from 'react';

// Interface defining the props that can be passed to the LazyImage component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string; // Path to the placeholder image (optional)
  threshold?: number; // Threshold for the IntersectionObserver (optional)
}

/**
 * LazyImage component (Memoized)
 * - Implements image lazy loading using IntersectionObserver.
 * - Wrapped with React.memo to prevent unnecessary re-renders.
 * - Falls back to immediate loading if IntersectionObserver is not supported.
 */
const LazyImage: React.FC<LazyImageProps> = memo(
  ({
    src,
    placeholderSrc = 'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzAwIDMwMCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImZsb3dpbmdHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjY2NjY2NjIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2VlZWVlZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjY2NjY2NjIiAvPgogICAgICA8YW5pbWF0ZVRyYW5zZm9ybQogICAgICAgIGF0dHJpYnV0ZU5hbWU9ImdyYWRpZW50VHJhbnNmb3JtIgogICAgICAgIHR5cGU9InRyYW5zbGF0ZSIKICAgICAgICBmcm9tPSItMSwwIgogICAgICAgIHRvPSIxLDAiCiAgICAgICAgZHVyPSIxLjVzIgogICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIgogICAgICAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZmxvd2luZ0dyYWRpZW50KSIgLz4KPC9zdmc+', // Default placeholder
    alt = '',
    threshold = 0.1, // Default threshold
    ...imgProps
  }) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
      // Check if IntersectionObserver is supported
      if (!('IntersectionObserver' in window)) {
        // Fallback: Load image immediately if not supported
        setIsInView(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          // Check if the image is intersecting and the ref is valid
          if (entry.isIntersecting && imgRef.current) {
            setIsInView(true);
            // Disconnect observer once the image is in view
            observer.disconnect();
          }
        },
        { threshold } // Use the threshold from props
      );

      const currentImgRef = imgRef.current; // Capture ref value for cleanup

      if (currentImgRef) {
        observer.observe(currentImgRef); // Start observing
      }

      // Cleanup observer on component unmount or when threshold changes
      return () => {
        observer.disconnect(); // Disconnect the observer
      };
      // Add threshold to dependency array for correctness
    }, [threshold]);

    // Determine the src based on visibility state
    const imageSrc = isInView && src ? src : placeholderSrc;

    return <img ref={imgRef} src={imageSrc} alt={alt} {...imgProps} />;
  }
);

// Add display name for better debugging
LazyImage.displayName = 'LazyImage';

export default LazyImage;
