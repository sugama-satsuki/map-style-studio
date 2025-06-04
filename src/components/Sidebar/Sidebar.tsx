import React from 'react';
import { Typography, Menu, Avatar, Space, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const items = [
    {
        key: 'theme',
        label: 'テーマ編集',
    },
    {
        key: 'layer',
        label: 'レイヤー単位編集',
    },
];

interface Props {
    selectedMenu: string;
    onChangeMenu: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<Props> = ({ selectedMenu, onChangeMenu }) => {
    return (
        <Flex vertical align='center' justify='space-between' gap={16} style={{ height: '100%' }}>
            <Menu
                mode="vertical"
                items={items}
                selectedKeys={[selectedMenu]}
                onClick={e => onChangeMenu(e.key)}
            />
            <div>
                <Space size={[8, 16]} wrap>
                    <Avatar size="large" icon={<UserOutlined />} />
                    <Flex vertical align="start">
                        <Text strong>ユーザー名</Text>
                        <Link href="https://ant.design" target="_blank">logout</Link>
                    </Flex>
                </Space>
            </div>
        </Flex>
    );
};

export default Sidebar;
