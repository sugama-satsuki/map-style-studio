import React, { useState } from 'react';
import { Button, Card, Flex, Layout, Typography } from 'antd';
import './LayerEditor.css';
import MapCanvas from '../MapCanvas/MapCanvas';
import Sidebar from '../Sidebar/Sidebar';
import { Header } from 'antd/es/layout/layout';
import ColorPicker from '../ColorPicker/ColorPicker';
import LayerList from '../LayerList/LayerList';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import FileImporter from '../FileImporter/FileImporter';
import StyleJsonViewer from '../StyleJsonViewer/StyleJsonViewer';
import { UndoOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Title } = Typography;

const LayerEditor: React.FC = () => {

  // サイドバーの選択状態を管理
  const [selectedMenu, setSelectedMenu] = useState('layer');
  const [style, setStyle] = useAtom(styleAtom);
  const prevStyleRef = React.useRef<typeof style | null>(null);

  // style編集前に前の状態を保存する関数
  const savePrevStyle = (newStyle: typeof style) => {
    prevStyleRef.current = newStyle ? JSON.parse(JSON.stringify(newStyle)) : null;
  };

  // style.jsonダウンロード処理
  const handleDownloadStyleJson = () => {
    if (!style) return;
    const blob = new Blob([JSON.stringify(style, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'style.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUndo = () => {
    if (prevStyleRef.current) {
      setStyle(prevStyleRef.current);
      prevStyleRef.current = null;
    }
  };

  // サイドバー内で表示するコンポーネントを切り替え
  let sidebarContent = null;
  if (selectedMenu === 'theme') {
    sidebarContent = <ColorPicker savePrevStyle={savePrevStyle} />;
  } else if (selectedMenu === 'layer') {
    sidebarContent = <LayerList savePrevStyle={savePrevStyle} />;
  } else if (selectedMenu === 'style-viewer') {
    sidebarContent = <StyleJsonViewer savePrevStyle={savePrevStyle} />;
  }

  return (
    <Layout className="layer-editor-root">
      <Header>
        <Flex justify='space-between' align='center' style={{ width: '100%', height: '100%' }}>
          <Title level={3} style={{color: '#fff', lineHeight: 1, margin: 0}}>map style studio</Title>
          <Flex gap={8}>
            { prevStyleRef.current && (
              <Button
                icon={<UndoOutlined />}
                onClick={handleUndo}
                style={{ marginRight: 8 }}
              >
                1つ前に戻す
              </Button>
            ) }
            <Button type="primary" onClick={handleDownloadStyleJson}>
              styleダウンロード
            </Button>
          </Flex>
        </Flex>
      </Header>
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <Sider
          width={ sidebarContent ? 665 : 200}
          data-testid="sidebar"
          className="layer-editor-sidebar"
        >
          <Flex justify='space-between' align='start' style={{ height: '100%' }}>
            <Sidebar selectedMenu={selectedMenu} onChangeMenu={setSelectedMenu} />
            <Card style={{ width: 465, backgroundColor: '#f9f8f8', height: '100%', overflowY: 'scroll' }} size='small'>
              { sidebarContent }
            </Card>
          </Flex>
        </Sider>
        <Layout>
          <Content
            data-testid="map"
            className="layer-editor-content"
          >
            { style ? 
              <MapCanvas />
              :
              <FileImporter />
            }
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayerEditor;
