import React from 'react';
import { expect, it, vi, describe, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LazyImage from '../LazyImage';

const TEST_ALT_TEXT = 'test image';
const REAL_IMAGE_SRC = 'real.jpg';
const PLACEHOLDER_IMAGE_SRC = 'placeholder.jpg';
const DEFAULT_PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMzAwIDMwMCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImZsb3dpbmdHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjY2NjY2NjIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2VlZWVlZSIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjY2NjY2NjIiAvPgogICAgICA8YW5pbWF0ZVRyYW5zZm9ybQogICAgICAgIGF0dHJpYnV0ZU5hbWU9ImdyYWRpZW50VHJhbnNmb3JtIgogICAgICAgIHR5cGU9InRyYW5zbGF0ZSIKICAgICAgICBmcm9tPSItMSwwIgogICAgICAgIHRvPSIxLDAiCiAgICAgICAgZHVyPSIxLjVzIgogICAgICAgIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIgogICAgICAgIGFuaW1hdGVvbnMoKTsKICAgICAgPC9hbmltYXRlVHJhbnNmb3JtPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9InVybCgjZmxvd2luZ0dyYWRpZW50KSIgLz4KPC9zdmc+';

/**
 * Test suite for LazyImage component
 * - Verifies lazy loading behavior and placeholder handling
 */
describe('LazyImage', () => {
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn((callback) => {
        intersectionCallback = callback;
        return {
          observe: vi.fn(),
          unobserve: vi.fn(),
          disconnect: vi.fn(),
        };
      })
    );
  });

  it('should render with placeholder initially', () => {
    render(
      <LazyImage src={REAL_IMAGE_SRC} alt={TEST_ALT_TEXT} placeholderSrc={PLACEHOLDER_IMAGE_SRC} />
    );

    const img = screen.getByAltText(TEST_ALT_TEXT);
    expect(img).toHaveAttribute('src', PLACEHOLDER_IMAGE_SRC);
  });

  it('should load real src when in view', async () => {
    render(
      <LazyImage src={REAL_IMAGE_SRC} alt={TEST_ALT_TEXT} placeholderSrc={PLACEHOLDER_IMAGE_SRC} />
    );

    intersectionCallback(
      [
        {
          isIntersecting: true,
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

    await waitFor(() => {
      const img = screen.getByAltText(TEST_ALT_TEXT);
      expect(img).toHaveAttribute('src', REAL_IMAGE_SRC);
    });
  });

  it('should use default placeholder when not provided', () => {
    render(<LazyImage src={REAL_IMAGE_SRC} alt={TEST_ALT_TEXT} />);

    const img = screen.getByAltText(TEST_ALT_TEXT);
    expect(img).toHaveAttribute('src', DEFAULT_PLACEHOLDER_SRC);
  });
});
