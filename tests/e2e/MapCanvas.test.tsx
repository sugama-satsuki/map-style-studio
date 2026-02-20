import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapCanvas from '../../src/components/MapCanvas/MapCanvas';

vi.mock('maplibre-gl', () => ({
  default: {
    Map: vi.fn().mockImplementation(() => ({
      on: vi.fn(),
      once: vi.fn(),
      off: vi.fn(),
      remove: vi.fn(),
      addControl: vi.fn(),
      getContainer: vi.fn(),
      getCenter: vi.fn(() => ({ lng: 139.767, lat: 35.681 })),
      getZoom: vi.fn(() => 10),
    })),
  },
}));

describe('MapCanvas', () => {
  test('マップ用のdivが存在する', () => {
    render(<MapCanvas />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});
