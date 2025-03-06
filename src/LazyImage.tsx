import React, { useEffect, useRef, useState } from 'react';

// Interface defining the props that can be passed to the LazyImage component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderSrc?: string; // Path to the placeholder image (optional)
  threshold?: number; // Threshold for the IntersectionObserver (optional)
}

/**
 * LazyImage component
 * - Implements image lazy loading, deferring image load until it enters the viewport
 * - Uses IntersectionObserver to detect when the image enters the viewport
 * - By default, uses a transparent 1x1 GIF as a placeholder, but supports custom placeholders
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src, // Path to the actual image to be loaded
  placeholderSrc = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', // Default placeholder image (1x1 transparent GIF)
  alt = '', // Alt text for the image
  threshold = 0.1, // Default threshold for IntersectionObserver
  ...imgProps // Additional HTML attributes to pass to the <img> tag
}) => {
  const imgRef = useRef<HTMLImageElement>(null); // Ref to reference the image DOM element
  const [isInView, setIsInView] = useState(false); // State to manage whether the image is in the viewport

  /**
   * Set up IntersectionObserver to detect when the image enters the viewport
   * - When it enters, load the actual image and disconnect the observer
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true); // Update state when the image enters the viewport
          observer.disconnect(); // No need to observe further, so disconnect
        }
      },
      { threshold } // Trigger when 10% of the image is visible
    );

    if (imgRef.current) {
      observer.observe(imgRef.current); // Start observing the image element
    }

    // Cleanup observer on component unmount
    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current); // Stop observing
      }
    };
  }, []); // Empty dependency array, so this runs once on mount

  // Use the actual src if in view, otherwise use the placeholder
  return <img ref={imgRef} src={isInView && src ? src : placeholderSrc} alt={alt} {...imgProps} />;
};

export default LazyImage;
