import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MapCanvas from '../../src/components/MapCanvas/MapCanvas';

// maplibreglのグローバルモック
// const mockSetStyle = jest.fn();

jest.mock('maplibre-gl', () => ({
  Map: function () {
    return {
      on: jest.fn(),
      remove: jest.fn(),
      addControl: jest.fn(),
      getContainer: jest.fn(),
    };
  },
}));

describe('MapCanvas', () => {

  test('MapCanvasコンポーネントがレンダリングされ、マップ用のdivが存在する', () => {
    render(<MapCanvas />);
    // MapCanvas内で map を描画するdiv の data-testid を "map-container" などで付与しておくと良い
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

//   test('style.jsonがmaplibre-glのmapにセットされる', () => {
//     render(<MapCanvas style={styleJson} />);
//     // styleJsonがsetStyleに渡されているか確認
//     expect(mockSetStyle).toHaveBeenCalledWith(styleJson);
//   });

});
