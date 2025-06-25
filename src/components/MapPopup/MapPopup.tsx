import { Button, Card, Space, Tooltip, Typography } from 'antd';
import React from 'react';
import { RobotOutlined } from '@ant-design/icons';
import './MapPopup.css';
import { useSetAtom } from 'jotai';
import { openExpressionCreatorAtom } from '../../atom';

type Props = {
    lngLat: [number, number];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: Record<string, any>[];
    point?: { x: number; y: number };
    onClose: () => void;
};

const MapPopup: React.FC<Props> = ({ lngLat, properties, point, onClose }) => {

    const { Text } = Typography;
    
    const setOpenExpressionCreator = useSetAtom(openExpressionCreatorAtom);

    if (!point) { return null; }

    return (
        <Card
            id='mapPopup'
            title={<strong>属性情報（{properties.length}件）</strong>}
            extra={
                <a onClick={onClose} style={{ cursor: 'pointer' }}>
                    閉じる
                </a>
            }
            style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                transform: 'translate(-50%, -100%)',
                zIndex: 1000,
                width: 360,
                maxHeight: 320
            }}
        >
            <Space direction="vertical" size={2} style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
                <Text strong>位置:{lngLat[0].toFixed(5)}, {lngLat[1].toFixed(5)}</Text>
                <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 4 }}>
                    {properties.map((props, idx) => (
                        <div style={{ position: 'relative' }} key={idx}>
                            <Tooltip title="Expression生成ツールを開く">
                                <Button 
                                    type="dashed" 
                                    icon={<RobotOutlined />} 
                                    className='showExpressionCreatorBtn'
                                    onClick={() => setOpenExpressionCreator(true)}
                                />
                            </Tooltip>
                            <pre
                                style={{
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-all',
                                    margin: 0,
                                    background: '#f7f7f7',
                                    borderRadius: 4,
                                    padding: 8,
                                    marginBottom: 8,
                                }}
                            >
                                {JSON.stringify(props, null, 2)}
                            </pre>
                        </div>
                    ))}
                </div>
            </Space>
            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    bottom: -10,
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    borderTop: '10px solid #fff',
                    filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))',
                }}
            />
        </Card>
    );
};

export default MapPopup;