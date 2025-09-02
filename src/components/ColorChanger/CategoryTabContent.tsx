import { Button, ColorPicker, Flex, Space, Typography } from "antd";
import { BgColorsOutlined } from '@ant-design/icons';
import { useState } from "react";
import { useAtom } from "jotai";
import { styleAtom } from "../../atom";
import { generateCategoryColorStyle, type CategoryColors } from "../../utils/generateCategoryColorStyle";

type CategoryColorProps = {
    savePrevStyle: (newStyle: maplibregl.StyleSpecification | undefined) => void
};

const { Text } = Typography;

const CATEGORY_LIST: { key: keyof CategoryColors; label: string }[] = [
    { key: 'building', label: '建物' },
    { key: 'background', label: '背景' },
    { key: 'grass', label: '草原' },
    { key: 'road', label: '道' },
    { key: 'highway', label: '高速道路' },
    { key: 'water', label: '水域・海' },
];


const CategoryTabContent: React.FC<CategoryColorProps> = ({ savePrevStyle }) => {

    const [categoryColors, setCategoryColors] = useState<CategoryColors>({
        building: '',
        background: '',
        grass: '',
        road: '',
        highway: '',
        water: ''
    });
    const [style, setStyle] = useAtom(styleAtom);

    // カテゴリ毎の色を変更
    const handleCategoryChange = (key: keyof CategoryColors, color: string) => {
        setCategoryColors(prev => ({ ...prev, [key]: color }));
    };

    // スタイル生成
    const generateStyleByCategory = async () => {
        if (!style || typeof style !== 'object') return;
        try {
            const newStyle = generateCategoryColorStyle(categoryColors, style);
            savePrevStyle(newStyle);
            setStyle(newStyle);
        } catch (e) {
            console.error('スタイル生成に失敗しました', e);
        }
    };
    
    return (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Text strong>各カテゴリの色を指定</Text>

            {CATEGORY_LIST.map(({ key, label }) => (
                <Flex align="center" gap={8} key={key}>
                    <Text>{label}</Text>
                    <ColorPicker
                        value={categoryColors[key]}
                        onChange={(_, hex) => handleCategoryChange(key, hex)}
                    />
                </Flex>
            ))}
            
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
};

export default CategoryTabContent;
