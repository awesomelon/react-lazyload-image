import { vi, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';

// IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});

beforeAll(() => {
  vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
});

afterAll(() => {
  vi.unstubAllGlobals();
});
