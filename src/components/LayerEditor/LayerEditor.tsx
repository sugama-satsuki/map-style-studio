import React from 'react';
import { Card, Tabs } from 'antd';
import ColorPicker from '../ColorPicker/ColorPicker';
import LayerList from '../LayerList/LayerList';
import type { StyleSpecification } from 'maplibre-gl';

interface Props {
  savePrevStyle: (newStyle: StyleSpecification | undefined) => void;
}

const LayerEditor: React.FC<Props> = ({ savePrevStyle }) => {
  return (
    <Card className='editor-card' id='layer-editor' size='small'>
      <Tabs
        defaultActiveKey="layer"
        items={[
          {
            key: 'layer',
            label: 'レイヤー編集',
            children: <LayerList savePrevStyle={savePrevStyle} />
          },
          {
            key: 'themeColor',
            label: 'テーマカラーで生成',
            children: <ColorPicker savePrevStyle={savePrevStyle} />,
          }
        ]}
      />
    </Card>
  );
};

export default LayerEditor;
