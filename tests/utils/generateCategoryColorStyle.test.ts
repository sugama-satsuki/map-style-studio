import { generateCategoryColorStyle, CategoryColors } from '../../src/utils/generateCategoryColorStyle';
import type { StyleSpecification } from 'maplibre-gl';

describe('generateCategoryColorStyle', () => {
  // ベースとなるスタイルオブジェクト
  const baseStyle: StyleSpecification = {
    version: 8,
    sources: {},
    layers: [
      {
        id: 'building-layer',
        type: 'fill',
        paint: { 'fill-color': '#000000' }
      },
      {
        id: 'background-layer',
        type: 'background',
        paint: { 'background-color': '#111111' }
      },
      {
        id: 'grass-layer',
        type: 'fill',
        paint: { 'fill-color': '#222222' }
      },
      {
        id: 'road-layer',
        type: 'line',
        paint: { 'line-color': '#333333' }
      },
      {
        id: 'highway-layer',
        type: 'line',
        paint: { 'line-color': '#444444' }
      }
    ]
  } as StyleSpecification;

  const colors: CategoryColors = {
    building: '#aaaaaa',
    background: '#bbbbbb',
    grass: '#cccccc',
    road: '#dddddd',
    highway: '#eeeeee'
  };

  it('各カテゴリの色が正しく変更されること', () => {
    // 各カテゴリの色が指定通りに変更されるかテスト
    const newStyle = generateCategoryColorStyle(colors, baseStyle);

    expect(newStyle.layers?.find(l => l.id === 'building-layer')?.paint?.['fill-color']).toBe(colors.building);
    expect(newStyle.layers?.find(l => l.id === 'background-layer')?.paint?.['background-color']).toBe(colors.background);
    expect(newStyle.layers?.find(l => l.id === 'grass-layer')?.paint?.['fill-color']).toBe(colors.grass);
    expect(newStyle.layers?.find(l => l.id === 'road-layer')?.paint?.['line-color']).toBe(colors.road);
    expect(newStyle.layers?.find(l => l.id === 'highway-layer')?.paint?.['line-color']).toBe(colors.highway);
  });

  it('カテゴリに該当しないレイヤーは変更されないこと', () => {
    // 関係ないレイヤーの色が変更されないかテスト
    const style: StyleSpecification = {
      ...baseStyle,
      layers: [
        ...baseStyle.layers,
        {
          id: 'unrelated-layer',
          type: 'symbol',
          paint: { 'icon-color': '#123456' }
        }
      ]
    } as StyleSpecification;
    const newStyle = generateCategoryColorStyle(colors, style);
    expect(newStyle.layers?.find(l => l.id === 'unrelated-layer')?.paint?.['icon-color']).toBe('#123456');
  });
});
