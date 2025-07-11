import React from 'react';
import { Card, Tabs } from 'antd';
import ThemeColorChanger from '../ThemeColorChanger/ThemeColorChanger';
import LayerList from '../LayerList/LayerList';
import type { StyleSpecification } from 'maplibre-gl';
import LayerSortList from '../LayerSortList/LayerSortList';

interface Props {
  savePrevStyle: (newStyle: StyleSpecification | undefined) => void;
  addLayer: (groupType: string) => void;
}

const LayerEditor: React.FC<Props> = ({ savePrevStyle, addLayer }) => {
  return (
    <Card className='editor-card' id='layer-editor' size='small'>
      <Tabs
        defaultActiveKey="layer"
        items={[
          {
            key: 'layer',
            label: 'レイヤー編集',
            children: <LayerList savePrevStyle={savePrevStyle} addLayer={addLayer} />
          },
          {
            key: 'themeColor',
            label: 'テーマカラーで生成',
            children: <ThemeColorChanger savePrevStyle={savePrevStyle} />,
          },
          {
            key: 'layerSorting',
            label: 'レイヤーの並び替え',
            children: <LayerSortList savePrevStyle={savePrevStyle} />,
          }
        ]}
      />
    </Card>
  );
};

export default LayerEditor;
