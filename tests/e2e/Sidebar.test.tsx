import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../../src/components/Sidebar/Sidebar';

describe('Sidebar', () => {
  const mockOnChangeMenu = jest.fn();

  test('メニュー項目が表示される', () => {
    render(<Sidebar selectedMenu="layer" onChangeMenu={mockOnChangeMenu} />);
    expect(screen.getByText('基本情報')).toBeInTheDocument();
    expect(screen.getByText('ソース')).toBeInTheDocument();
    expect(screen.getByText('レイヤー')).toBeInTheDocument();
    expect(screen.getByText('json全体')).toBeInTheDocument();
  });

  test('スプライトメニューに「準備中」タグが表示される', () => {
    render(<Sidebar selectedMenu="sprite" onChangeMenu={mockOnChangeMenu} />);
    expect(screen.getByText('スプライト')).toBeInTheDocument();
    expect(screen.getByText('準備中')).toBeInTheDocument();
  });
});
