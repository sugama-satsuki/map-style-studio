import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileImporter from '../../src/components/FileImporter/FileImporter';
// import { waitFor } from '@testing-library/react';


describe('FileImporter', () => {

    test('FileImporterコンポーネントがレンダリングされる', () => {
        render(<FileImporter />);
        const fileInput = screen.getByText('クリックまたはファイルをドラッグしてアップロード');
        const description = screen.getByText('地図スタイルをインポートするには、JSONファイルを選択してください。');
        expect(fileInput).toBeInTheDocument();
        expect(description).toBeInTheDocument();
    });

    test('jsonファイル以外は選択できない', () => {
        render(<FileImporter />);
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input).not.toBeNull();
        expect(input.accept).toBe('.json');
    });

    // TODO: 以下プロトタイプ作成後対応
    //   test('ファイル選択時にファイル名が表示される', async () => {
    //     render(<FileImporter />);
    //     const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    //     const file = new File(['dummy content'], 'style.json', { type: 'application/json' });

    //     Object.defineProperty(fileInput, 'files', {
    //         value: [file],
    //         writable: false,
    //     });

    //     fireEvent.change(fileInput);

    //     // findByTextで十分に待つ
    //     expect(await screen.findByText('style.json')).toBeInTheDocument();
    //     });

    //   test('ファイルをアップロードしたら「地図を表示する」ボタンが表示される', () => {
    //     render(<FileImporter />);
    //     const fileInput = screen.getByLabelText('ファイルを選択');
    //     const file = new File(['dummy content'], 'style.json', { type: 'application/json' });

    //     Object.defineProperty(fileInput, 'files', {
    //       value: [file],
    //       writable: false,
    //     });

    //     fireEvent.change(fileInput);

    //     expect(screen.getByRole('button', { name: '地図を表示する' })).toBeInTheDocument();
    //   });

});
