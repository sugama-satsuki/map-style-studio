import React, { useState } from 'react';
import { Button, Flex, Layout, Typography } from 'antd';
import './StyleEditor.css';
import MapCanvas from '../MapCanvas/MapCanvas';
import Sidebar from '../Sidebar/Sidebar';
import { Header } from 'antd/es/layout/layout';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import FileImporter from '../FileImporter/FileImporter';
import StyleJsonViewer from '../StyleJsonViewer/StyleJsonViewer';
import { FileOutlined, UndoOutlined } from '@ant-design/icons';
import sampleStyle from '../../assets/sample-style.json';
import type { StyleSpecification } from 'maplibre-gl';
import StyleUrlLoader from '../StyleUrlLoader/StyleUrlLoader';
import BasicInfo from '../BasicInfo/BasicInfo';
import LayerEditor from '../LayerEditor/LayerEditor';
import SourceEditor from '../SourceEditor/SourceEditor';
import SpriteEditor from '../SpriteEditor/SpriteEditor';


const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const StyleEditor: React.FC = () => {

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

  const handleOpenSampleStyle = () => {
    setStyle(sampleStyle as unknown as StyleSpecification);
  };

  // サイドバー内で表示するコンポーネントを切り替え
  let sidebarContent = null;
  if (selectedMenu === 'basic-info') {
    sidebarContent = <BasicInfo />;
  } else if (selectedMenu === 'sources') {
    sidebarContent = <SourceEditor savePrevStyle={savePrevStyle} />;
  } else if (selectedMenu === 'sprite') {
    sidebarContent = <SpriteEditor savePrevStyle={savePrevStyle} />;
  } else if (selectedMenu === 'layer') {
    sidebarContent = <LayerEditor savePrevStyle={savePrevStyle} />;
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
          width={ sidebarContent ? 665 : 160}
          data-testid="sidebar"
          className="layer-editor-sidebar"
        >
          <Flex justify='space-between' align='start' style={{ height: '100%' }}>
            <Sidebar selectedMenu={selectedMenu} onChangeMenu={setSelectedMenu} />
            { sidebarContent }
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
              <Flex
                vertical
                justify='center'
                align='center'
                gap={16}
                style={{ textAlign: 'center', padding: '20px', height: '100%' }}
              >
                <Button
                  type="default" 
                  size='large'
                  icon={<FileOutlined />}
                  onClick={handleOpenSampleStyle}
                >
                  サンプルスタイルを開く
                </Button>
                <Text strong>OR</Text>
                <StyleUrlLoader />
                <Text strong>OR</Text>
                <FileImporter />
              </Flex>
            }
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default StyleEditor;
