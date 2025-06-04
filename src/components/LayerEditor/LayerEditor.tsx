import React from 'react';
import { Layout, Typography } from 'antd';
import './LayerEditor.css';
import MapCanvas from '../MapCanvas/MapCanvas';
import Sidebar from '../Sidebar/Sidebar';
import { Header } from 'antd/es/layout/layout';

const { Sider, Content } = Layout;
const { Title } = Typography;

const LayerEditor: React.FC = () => {
  return (
    <Layout className="layer-editor-root">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{color: '#fff'}}>アプリ名</Title>
      </Header>
      <Layout>
        <Sider
          width={200}
          data-testid="sidebar"
          className="layer-editor-sidebar"
        >
          <Sidebar />
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
