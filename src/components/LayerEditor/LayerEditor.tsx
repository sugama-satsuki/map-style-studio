import React from 'react';
import { Card, Tabs } from 'antd';
import ColorChanger from '../ColorChanger/ColorChanger';
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
        defaultActiveKey="color"
        type="card"
        items={[
          {
            key: 'color',
            label: 'カラー編集',
            children: <ColorChanger savePrevStyle={savePrevStyle} />,
          },
          {
            key: 'layer',
            label: 'レイヤー単位で編集',
            children: <LayerList savePrevStyle={savePrevStyle} addLayer={addLayer} />
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
