import React, { useState } from 'react';
import { Space, message, Upload, Typography, type UploadProps, Row, Col, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './FileImporter.css';
import { useSetAtom } from 'jotai';
import { styleAtom } from '../../atom';

const { Text } = Typography;
const { Dragger } = Upload;

type Props = {
  onShowLayerEditor?: () => void;
};

const FileImporter: React.FC<Props> = () => {
  const setStyle = useSetAtom(styleAtom);
  const [spinning, setSpinning] = useState(false);

  const props: UploadProps = {
    name: 'file',
    accept: '.json',
    multiple: false,
    beforeUpload(file) {
      const isJson = file.name.endsWith('.json');
      if (!isJson) {
        message.error('JSONファイルのみアップロードできます');
      }
      return isJson || Upload.LIST_IGNORE;
    },
    customRequest({ file, onSuccess }) {
      setSpinning(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target?.result as string);
        setStyle(json);
        if (onSuccess) { onSuccess("ok"); }
        setSpinning(false);
      };
      reader.readAsText(file as File);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Row justify="center" align="middle">
      <Col>
        <div className="file-importer-container">
          <Dragger {...props} showUploadList={false} style={{ backgroundColor: '#fff' }}>
            {spinning ?
              <Spin spinning={spinning} tip="styleを読み込んでいます" />
              :
              <Space direction="vertical">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <Text strong>クリックまたはファイルをドラッグしてアップロード</Text>
                <Text type="secondary">地図スタイルをインポートするには、JSONファイルを選択してください。</Text>
              </Space>
            }
          </Dragger>
        </div>
      </Col>
    </Row>
  );
};

export default FileImporter;
