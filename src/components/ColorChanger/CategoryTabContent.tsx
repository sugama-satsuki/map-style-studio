import { Button, ColorPicker, Flex, Space, Typography } from "antd";
import { BgColorsOutlined } from '@ant-design/icons';

type CategoryColorProps = {
    categoryColors: { [key: string]: string };
    handleCategoryChange: (key: string, color: string) => void;
    generateStyleByCategory: () => void;
};

const { Text } = Typography;


const CategoryTabContent: React.FC<CategoryColorProps> = ({ categoryColors, handleCategoryChange, generateStyleByCategory }) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text strong>各カテゴリの色を指定</Text>
        <Flex align="center" gap={8}>
            <Text>建物</Text>
            <ColorPicker
                value={categoryColors.building}
                onChange={(_, hex) => handleCategoryChange('building', hex)}
            />
        </Flex>
        <Flex align="center" gap={8}>
            <Text>背景</Text>
            <ColorPicker
                value={categoryColors.background}
                onChange={(_, hex) => handleCategoryChange('background', hex)}
            />
        </Flex>
        <Flex align="center" gap={8}>
            <Text>草原</Text>
            <ColorPicker
                value={categoryColors.grass}
                onChange={(_, hex) => handleCategoryChange('grass', hex)}
            />
        </Flex>
        <Flex align="center" gap={8}>
            <Text>道</Text>
            <ColorPicker
                value={categoryColors.road}
                onChange={(_, hex) => handleCategoryChange('road', hex)}
            />
        </Flex>
        <Flex align="center" gap={8}>
            <Text>高速道路</Text>
            <ColorPicker
                value={categoryColors.highway}
                onChange={(_, hex) => handleCategoryChange('highway', hex)}
            />
        </Flex>
        <Button
            type="primary"
            icon={<BgColorsOutlined />}
            size='large'
            style={{ width: '100%' }}
            onClick={generateStyleByCategory}
        >
            style生成
        </Button>
    </Space>
);

export default CategoryTabContent;
