import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Sidebar from '../../src/components/Sidebar/Sidebar';

describe('Sidebar', () => {
  test('Sidebarコンポーネントがレンダリングされる', () => {
    render(<Sidebar />);
    // サイドバーのタイトルやレイヤー一覧が表示されるかを確認
    expect(screen.getByText('スタイルを編集')).toBeInTheDocument();
    expect(screen.getByText('テーマカラー')).toBeInTheDocument();
    expect(screen.getByText('レイヤー単位')).toBeInTheDocument();
  });
});