import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LayerList from '../../src/components/LayerList/LayerList';

describe('LayerList', () => {
  test('レイヤー一覧のタイトルや主要UIが表示される', () => {
    render(<LayerList />);
    // タイトル
    expect(screen.getByText(/Layers|レイヤー一覧/)).toBeInTheDocument();
    // 検索ボックス
    expect(screen.getByPlaceholderText(/Search layers|レイヤーを検索/)).toBeInTheDocument();
    // 追加ボタン
    expect(screen.getByRole('button')).toBeInTheDocument();
    // 主要なカテゴリ
    expect(screen.getByText(/point/)).toBeInTheDocument();
    expect(screen.getByText(/symbol/)).toBeInTheDocument();
    expect(screen.getByText(/label/)).toBeInTheDocument();
    expect(screen.getByText(/line/)).toBeInTheDocument();
    expect(screen.getByText(/polygon/)).toBeInTheDocument();
  });
});
