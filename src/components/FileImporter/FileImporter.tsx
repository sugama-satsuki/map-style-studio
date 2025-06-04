import React, { useState } from 'react';
import { Space, message, Button, Upload, Typography, type UploadProps, Row, Col } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import './FileImporter.css';
import { useSetAtom } from 'jotai';
import { styleAtom } from '../../atom';

const { Text } = Typography;
const { Dragger } = Upload;

type Props = {
  onShowLayerEditor?: () => void;
};

const FileImporter: React.FC<Props> = ({ onShowLayerEditor }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSelected, setFileSelected] = useState(false);
  const setStyle = useSetAtom(styleAtom);

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
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = JSON.parse(e.target?.result as string);
        setStyle(json);
        setFileName((file as File).name);
        setFileSelected(true);
        if (onSuccess) onSuccess("ok");
      };
      reader.readAsText(file as File);
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      <Col>
        <div className="file-importer-container">
          <Dragger {...props} showUploadList={false}>
            <Space direction="vertical">
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <Text strong>クリックまたはファイルをドラッグしてアップロード</Text>
              <Text type="secondary">地図スタイルをインポートするには、JSONファイルを選択してください。</Text>
            </Space>
          </Dragger>
          {fileName && (
            <div className="file-importer-filename">
              <Text>{fileName}</Text>
            </div>
          )}
          {fileSelected && (
            <Button type="primary" size='large' onClick={onShowLayerEditor}>
              地図を表示する
            </Button>
          )}
        </div>
      </Col>
    </Row>
  );
};

export default FileImporter;
