import React from 'react';
import { Typography, Menu, Avatar, Space, Flex, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Text, Link } = Typography;

const items = [
    {
        key: 'basic-info',
        label: '基本情報',
    },
    {
        key: 'sprite',
        label: (
            <span>
                スプライト <Tag color="default" style={{ marginLeft: 4, fontSize: 10 }}>準備中</Tag>
            </span>
        ),
    },
    {
        key: 'sources',
        label: 'ソース',
    },
    {
        key: 'layer',
        label: 'レイヤー',
    },
    {
        key: 'style',
        label: 'json全体',
    }
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
