import { renderHook } from '@testing-library/react';
import { useColorfulJson } from '../../src/utils/renderColorfulJson';
import React from 'react';

describe('useColorfulJson', () => {
  it('カラーコードを含む JSON → span 要素 (カラースウォッチ) が返る', () => {
    const json = '{"fill-color": "#ff0000"}';
    const { result } = renderHook(() => useColorfulJson(json));

    // 返り値は ReactNode の配列
    expect(Array.isArray(result.current)).toBe(true);
    // '#ff0000' を含む span 要素が含まれているはず
    const hasColorSpan = result.current.some(
      node => React.isValidElement(node) && node.type === 'span'
    );
    expect(hasColorSpan).toBe(true);
  });

  it('rgba カラーコードを含む JSON も処理する', () => {
    const json = '{"line-color": "rgba(255,0,0,0.5)"}';
    const { result } = renderHook(() => useColorfulJson(json));
    expect(Array.isArray(result.current)).toBe(true);
    const hasColorSpan = result.current.some(
      node => React.isValidElement(node) && node.type === 'span'
    );
    expect(hasColorSpan).toBe(true);
  });

  it('hsl カラーコードを含む JSON も処理する', () => {
    const json = '{"background-color": "hsl(120,100%,50%)"}';
    const { result } = renderHook(() => useColorfulJson(json));
    expect(Array.isArray(result.current)).toBe(true);
    const hasColorSpan = result.current.some(
      node => React.isValidElement(node) && node.type === 'span'
    );
    expect(hasColorSpan).toBe(true);
  });

  it('カラーコードがない JSON → 文字列のみ返る', () => {
    const json = '{"version": 8, "sources": {}}';
    const { result } = renderHook(() => useColorfulJson(json));
    expect(Array.isArray(result.current)).toBe(true);
    // span 要素は含まれない
    const hasColorSpan = result.current.some(
      node => React.isValidElement(node) && node.type === 'span'
    );
    expect(hasColorSpan).toBe(false);
    // テキストとして全体が含まれる
    const text = result.current.join('');
    expect(text).toContain('"version"');
  });

  it('空文字列は空配列を返す', () => {
    const { result } = renderHook(() => useColorfulJson(''));
    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(0);
  });

  it('json が変わると再計算される (useMemo)', () => {
    const { result, rerender } = renderHook(({ json }: { json: string }) => useColorfulJson(json), {
      initialProps: { json: '{"a": "#ff0000"}' },
    });
    const first = result.current;

    rerender({ json: '{"a": "#0000ff"}' });
    const second = result.current;

    // 異なるオブジェクトが返される
    expect(first).not.toBe(second);
  });
});
