import React from 'react';
import { expect, it, vi, describe, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from '../LazyImage';

/**
 * Test suite for LazyImage component
 * - Verifies lazy loading behavior and placeholder handling
 */
describe('LazyImage', () => {
  let intersectionCallback: IntersectionObserverCallback; // Variable to store the IntersectionObserver callback

  /**
   * Mock IntersectionObserver before each test
   * - Replaces the real browser API with a controllable mock
   */
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback) => {
        intersectionCallback = callback; // Store the callback
        return {
          observe: vi.fn(), // Mock observe method
          unobserve: vi.fn(), // Mock unobserve method
          disconnect: vi.fn(), // Mock disconnect method
        };
      })
    );
  });

  /**
   * Ensure the placeholder is displayed on initial render
   */
  it('should render with placeholder initially', () => {
    const placeholderSrc = 'placeholder.jpg';

    render(<LazyImage src='real.jpg' alt='test' placeholderSrc={placeholderSrc} />);

    const img = screen.getByAltText('test');
    expect(img).toHaveAttribute('src', placeholderSrc); // Verify the placeholder is set correctly
  });

  /**
   * Ensure the real image is loaded when it enters the viewport
   */
  it('should load real src when in view', async () => {
    const realSrc = 'real.jpg';
    const placeholderSrc = 'placeholder.jpg';

    render(<LazyImage src={realSrc} alt='test' placeholderSrc={placeholderSrc} />);

    // Simulate the image entering the viewport
    intersectionCallback(
      [
        {
          isIntersecting: true, // The image is now in view
          target: document.createElement('div'),
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: 1,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: 0,
        },
      ] as IntersectionObserverEntry[],
      {} as IntersectionObserver
    );

    // Wait for the async update and verify the real src is applied
    await waitFor(() => {
      const img = screen.getByAltText('test');
      expect(img).toHaveAttribute('src', realSrc); // Verify the real image is loaded
    });
  });

  /**
   * Ensure the default placeholder is used when no placeholderSrc is provided
   */
  it('should use default placeholder when not provided', () => {
    const defaultPlaceholder =
      'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

    render(<LazyImage src='real.jpg' alt='test' />);

    const img = screen.getByAltText('test');
    expect(img).toHaveAttribute('src', defaultPlaceholder); // Verify the default placeholder is applied
  });
});
