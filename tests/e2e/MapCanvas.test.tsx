import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapCanvas from '../../src/components/MapCanvas/MapCanvas';

jest.mock('maplibre-gl', () => ({
  Map: function () {
    return {
      on: jest.fn(),
      once: jest.fn(),
      off: jest.fn(),
      remove: jest.fn(),
      addControl: jest.fn(),
      getContainer: jest.fn(),
      getCenter: jest.fn(() => ({ lng: 139.767, lat: 35.681 })),
      getZoom: jest.fn(() => 10),
    };
  },
}));

describe('MapCanvas', () => {
  test('マップ用のdivが存在する', () => {
    render(<MapCanvas />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});
