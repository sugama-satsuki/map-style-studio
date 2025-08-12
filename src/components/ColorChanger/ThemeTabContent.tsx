import { Button, ColorPicker, Flex, Space, Typography } from "antd";
import { BgColorsOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';

type ColorProps = {
    colors: string[];
    setColors: React.Dispatch<React.SetStateAction<string[]>>;
    handleChange: (index: number, color: string) => void;
    generateStyleByTheme: () => void;
};

const { Text } = Typography;

const ThemeTabContent: React.FC<ColorProps> = ({ colors, setColors, handleChange, generateStyleByTheme }) => (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Text strong>テーマカラーを選択（3色まで）</Text>
        {colors.map((color, idx) => (
            <Flex key={idx} align="center" justify={'space-between'} gap={8}>
                <Flex align="center" justify={'left'} gap={8}>
                    <Text>テーマカラー {idx + 1}</Text>
                    <ColorPicker
                        key={idx}
                        value={color}
                        onChange={(_, hex) => handleChange(idx, hex)}
                        aria-label={`テーマカラー${idx + 1}`}
                    />
                </Flex>
                <Button
                    type="dashed"
                    shape="circle"
                    icon={<CloseOutlined />}
                    onClick={() => setColors(colors.filter((_, i) => i !== idx))}
                    disabled={colors.length === 1}
                />
            </Flex>
        ))}
        {colors.length < 3 &&
            <Button icon={<PlusOutlined />} iconPosition='start' onClick={() => { setColors([...colors, '#fff']); }}>
                カラーを追加
            </Button>
        }
        <Button
            type="primary"
            icon={<BgColorsOutlined />}
            size='large'
            style={{ width: '100%' }}
            onClick={generateStyleByTheme}
        >
            style生成
        </Button>
    </Space>
);

export default ThemeTabContent;
