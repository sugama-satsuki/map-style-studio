import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import LayerList from '../../src/components/LayerList/LayerList';

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

describe('LayerList', () => {
  const mockSavePrevStyle = jest.fn();
  const mockAddLayer = jest.fn();

  test('LayerListコンポーネントがレンダリングされる', () => {
    const { container } = render(
      <LayerList savePrevStyle={mockSavePrevStyle} addLayer={mockAddLayer} />
    );
    expect(container).toBeTruthy();
  });
});
