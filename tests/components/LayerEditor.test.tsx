import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LayerEditor from '../../src/components/LayerEditor/LayerEditor';

describe('LayerEditor', () => {
  test('LayerEditorコンポーネントがレンダリングされる', () => {
    render(<LayerEditor />);
    // サイドバーやmapの要素が存在するか確認
    expect(screen.getByText('アプリ名')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });
    // TODO：プロトタイプ作成後にテスト追加
});
