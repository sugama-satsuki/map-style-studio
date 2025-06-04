import React from 'react';
import { Typography, Menu, Avatar, Space, Flex } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Title, Text, Link } = Typography;

const items = [
  {
    key: 'style',
    label: 'テーマカラー',
  },
  {
    key: 'layer',
    label: 'レイヤー単位',
  },
];

const Sidebar: React.FC = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div>
        <Title level={5}>スタイルを編集</Title>
        <Menu
          mode="vertical"
          items={items}
          defaultSelectedKeys={['style']}
        />
      </div>
      <div style={{ marginTop: 'auto' }}>
        <Space size={[8, 16]} wrap>
          <Avatar size="large" icon={<UserOutlined />} />
          <Flex vertical align="start">
            <Text strong>ユーザー名</Text>
            <Link href="https://ant.design" target="_blank">logout</Link>
          </Flex>
        </Space>
      </div>
    </div>
  );
};

export default Sidebar;