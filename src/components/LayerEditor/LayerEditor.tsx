import React, { useState } from 'react';
import { Card, Flex, Layout, Typography } from 'antd';
import './LayerEditor.css';
import MapCanvas from '../MapCanvas/MapCanvas';
import Sidebar from '../Sidebar/Sidebar';
import { Header } from 'antd/es/layout/layout';
import ColorPicker from '../ColorPicker/ColorPicker';
import LayerList from '../LayerList/LayerList';

const { Sider, Content } = Layout;
const { Title } = Typography;

const LayerEditor: React.FC = () => {

  // サイドバーの選択状態を管理
  const [selectedMenu, setSelectedMenu] = useState('theme');

  // サイドバー内で表示するコンポーネントを切り替え
  let sidebarContent = null;
  if (selectedMenu === 'theme') {
    sidebarContent = <ColorPicker />;
  } else if (selectedMenu === 'layer') {
    sidebarContent = <LayerList />;
  }

  return (
    <Layout className="layer-editor-root">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{color: '#fff'}}>アプリ名</Title>
      </Header>
      <Layout>
        <Sider
          width={ sidebarContent ? 500 : 200}
          data-testid="sidebar"
          className="layer-editor-sidebar"
        >
          <Flex justify='space-between' align='start'>
            <Sidebar selectedMenu={selectedMenu} onChangeMenu={setSelectedMenu} />
            <Card style={{ width: 300, backgroundColor: '#f9f8f8' }}>
              { sidebarContent }
            </Card>
          </Flex>
        </Sider>
        <Layout>
          <Content
            data-testid="map"
            className="layer-editor-content"
          >
            <MapCanvas />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayerEditor;
