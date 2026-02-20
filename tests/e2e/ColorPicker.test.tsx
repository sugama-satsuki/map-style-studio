import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ColorChanger from '../../src/components/ColorChanger/ColorChanger';

describe('ColorChanger', () => {
  const mockSavePrevStyle = jest.fn();

  test('ColorChangerコンポーネントがレンダリングされる', () => {
    const { container } = render(<ColorChanger savePrevStyle={mockSavePrevStyle} />);
    expect(container).toBeTruthy();
  });
});
