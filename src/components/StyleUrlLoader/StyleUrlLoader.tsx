import React, { useState } from 'react';
import { Input, Button, Space, message } from 'antd';
import { useAtom } from 'jotai';
import { styleAtom } from '../../atom';

const StyleUrlLoader: React.FC = () => {
    const [url, setUrl] = useState('');
    const [, setStyle] = useAtom(styleAtom);
    const [loading, setLoading] = useState(false);

    const handleLoad = async () => {
        if (!url) {
            message.warning('URLを入力してください');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('取得に失敗しました');
            const json = await res.json();
            setStyle(json);
            message.success('style.jsonを読み込みました');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
            message.error('style.jsonの読み込みに失敗しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Space.Compact style={{ width: '90%', boxSizing: 'border-box' }}>
            <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="URL指定でstyleを読み込む"
                disabled={loading}
                style={{ height: 40 }}
            />
            <Button
                type="primary"
                onClick={handleLoad}
                loading={loading}
                style={{ height: 40 }}
            >
                読み込む
            </Button>
        </Space.Compact>
    );
};

export default StyleUrlLoader;
