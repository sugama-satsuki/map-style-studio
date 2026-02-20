import React, { useState } from 'react';
import { Button, Flex, Form, Layout, Typography, Tag } from 'antd';
import './StyleEditor.css';
import MapCanvas from '../MapCanvas/MapCanvas';
import Sidebar from '../Sidebar/Sidebar';
import { Header } from 'antd/es/layout/layout';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';
import FileImporter from '../FileImporter/FileImporter';
import StyleJsonViewer from '../StyleJsonViewer/StyleJsonViewer';
import { DownloadOutlined, FileOutlined, LinkOutlined, FolderOpenOutlined } from '@ant-design/icons';
import sampleStyle from '../../assets/sample-style.json';
import type { StyleSpecification } from 'maplibre-gl';
import StyleUrlLoader from '../StyleUrlLoader/StyleUrlLoader';
import BasicInfo from '../BasicInfo/BasicInfo';
import LayerEditor from '../LayerEditor/LayerEditor';
import SourceEditor from '../SourceEditor/SourceEditor';
import AddLayerModal from '../AddLayerModal/AddLayerModal';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const GEOLONIA_BASIC_STYLE = 'https://smartmap.styles.geoloniamaps.com/style.json';

const StyleEditor: React.FC = () => {
  // サイドバーの選択状態を管理
  const [selectedMenu, setSelectedMenu] = useState('layer');
  const [style, setStyle] = useAtom(styleAtom);
  const prevStyleRef = React.useRef<typeof style | null>(null);

  // style.json読み込みエラー状態
  const [loadError, setLoadError] = useState(false);

  // 新規レイヤー追加用のstate
  const [addLayerModalOpen, setAddLayerModalOpen] = useState(false);
  const [addLayerGroupType, setAddLayerGroupType] = useState<string | null>(null);
  const [addLayerForm] = Form.useForm();

  // LayerListから呼び出す用
  const handleAddLayer = (groupType: string) => {
    setAddLayerGroupType(groupType);
    setAddLayerModalOpen(true);
    addLayerForm.resetFields();
  };

  // 新規レイヤー追加処理
  const handleAddLayerOk = () => {
    addLayerForm.validateFields().then(values => {
      if (!style || typeof style === 'string') { return; }
      const newLayer = {
        id: values.id,
        type: addLayerGroupType,
        source: values.source,
        'source-layer': values.sourceLayer,
        layout: values.layout ? JSON.parse(values.layout) : {},
        filter: values.filter ? JSON.parse(values.filter) : undefined,
        paint: values.paint ? JSON.parse(values.paint) : {},
      };
      const newStyle = {
        ...style,
        layers: [...(style?.layers ?? []), newLayer]
      };
      setStyle(newStyle as StyleSpecification);
      setAddLayerModalOpen(false);
    });
  };

  const handleAddLayerCancel = () => {
    setAddLayerModalOpen(false);
  };

  const handleChangeStyle = () => {
    if (style && typeof style !== 'string') {
      setStyle(undefined);
      prevStyleRef.current = null;
    }
    setLoadError(false);
  }

  // style編集前に前の状態を保存する関数
  const savePrevStyle = (newStyle: typeof style) => {
    prevStyleRef.current = newStyle ? JSON.parse(JSON.stringify(newStyle)) : null;
  };

  // style.jsonダウンロード処理
  const handleDownloadStyleJson = () => {
    if (!style) { return; }
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const defaultFileName = `style_${yyyy}${mm}${dd}.json`;

    const fileName = window.prompt('保存するファイル名を入力してください', defaultFileName);
    if (!fileName) { return; }

    const blob = new Blob([JSON.stringify(style, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenSampleStyle = () => {
    setStyle(sampleStyle as unknown as StyleSpecification);
    setLoadError(false);
  };

  const handleOpenGeoloniaStyle = () => {
    setStyle(GEOLONIA_BASIC_STYLE);
    setLoadError(false);
  };

  // サイドバー内で表示するコンポーネントを切り替え
  let sidebarContent = null;
  if (selectedMenu === 'basic-info') {
    sidebarContent = <BasicInfo />;
  } else if (selectedMenu === 'sprite') {
    sidebarContent = (
      <Flex vertical align='center' justify='center' gap={12} style={{ padding: 32, flex: 1 }}>
        <Text style={{ fontSize: 32 }}>🖼️</Text>
        <Text strong style={{ fontSize: 16 }}>スプライト機能は準備中です</Text>
        <Text type="secondary" style={{ textAlign: 'center', maxWidth: 280 }}>
          スプライトとは、地図上に表示するアイコン画像のセットです。
          この機能は近日公開予定です。
        </Text>
      </Flex>
    );
  } else if (selectedMenu === 'sources') {
    sidebarContent = <SourceEditor savePrevStyle={savePrevStyle} />;
  } else if (selectedMenu === 'layer') {
    sidebarContent = <LayerEditor savePrevStyle={savePrevStyle} addLayer={handleAddLayer} />;
  } else if (selectedMenu === 'style') {
    sidebarContent = <StyleJsonViewer savePrevStyle={savePrevStyle} />;
  }

  return (
    <Layout className="layer-editor-root">
      <Header>
        <Flex justify='space-between' align='center' style={{ width: '100%', height: '100%' }}>
          <Title level={3} style={{color: '#fff', lineHeight: 1, margin: 0}}>map style studio</Title>
          { style && 
            <Flex gap={8}>
              <Button type="default" onClick={handleChangeStyle}>
                別のスタイルを読み込む
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownloadStyleJson}
                data-testid="download-button"
              >
                スタイルを保存する
              </Button>
            </Flex>
          }
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
                gap={8}
                style={{ textAlign: 'center', padding: '40px 20px', height: '100%' }}
              >
                <Title level={3} style={{ marginBottom: 4 }}>地図スタイルを読み込む</Title>
                <Text type="secondary" style={{ marginBottom: 24, maxWidth: 480 }}>
                  スタイルとは、地図の色・デザインを定義するJSONファイルです。
                  以下のいずれかの方法で読み込んでください。
                </Text>
                {loadError && (
                  <Text type="danger" strong style={{ marginBottom: 8 }}>スタイルの読み込みに失敗しました</Text>
                )}
                <Flex vertical align='center' gap={4}>
                  <Button
                    type="primary"
                    size='large'
                    icon={<FileOutlined />}
                    onClick={handleOpenGeoloniaStyle}
                    data-testid="open-geolonia-style-button"
                  >
                    Geolonia 標準スタイルを開く
                  </Button>
                  <Text type="secondary" style={{ fontSize: 12 }}>Geoloniaの基本地図スタイルで始める</Text>
                </Flex>
                <Text strong style={{ margin: '8px 0' }}>OR</Text>
                <Flex vertical align='center' gap={4}>
                  <Button
                    type="default"
                    size='large'
                    icon={<FileOutlined />}
                    onClick={handleOpenSampleStyle}
                    data-testid="open-sample-style-button"
                  >
                    サンプルスタイルを開く
                  </Button>
                  <Text type="secondary" style={{ fontSize: 12 }}>デモ用のシンプルなスタイルで試す</Text>
                </Flex>
                <Text strong style={{ margin: '8px 0' }}>OR</Text>
                <Flex vertical align='center' gap={4} style={{ width: '100%', maxWidth: 400 }}>
                  <Flex align='center' gap={6}>
                    <LinkOutlined />
                    <Text strong>URLから読み込む</Text>
                  </Flex>
                  <StyleUrlLoader setLoadError={setLoadError} />
                  <Text type="secondary" style={{ fontSize: 12 }}>スタイルJSONのURLを貼り付けてください</Text>
                </Flex>
                <Text strong style={{ margin: '8px 0' }}>OR</Text>
                <Flex vertical align='center' gap={4}>
                  <Flex align='center' gap={6}>
                    <FolderOpenOutlined />
                    <Text strong>ファイルから読み込む</Text>
                  </Flex>
                  <FileImporter setLoadError={setLoadError} />
                  <Text type="secondary" style={{ fontSize: 12 }}>お手持ちのJSONファイルをアップロード</Text>
                </Flex>
              </Flex>
            }
          </Content>
        </Layout>
      </Layout>
      <AddLayerModal
        open={addLayerModalOpen}
        onOk={handleAddLayerOk}
        onCancel={handleAddLayerCancel}
        form={addLayerForm} 
        layers={style && typeof style !== 'string' ? style?.layers : []} 
      />
    </Layout>
  );
};

export default StyleEditor;
