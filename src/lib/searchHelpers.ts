import type { LayerSpecification } from "maplibre-gl";
import { isBlackColor, isBlueColor, isBrownColor, isGreenColor, isRedColor, isWhiteColor, isYellowColor } from "./colorHelpers";

export function isLayerMatched(layer: LayerSpecification, search: string): boolean {
    const searchLower = search.toLowerCase();
    // レイヤーID
    if (layer.id.toLowerCase().includes(searchLower)) return true;
    // paint, filter, layout の中身も文字列化して検索
    const paintStr = layer.paint ? JSON.stringify(layer.paint).toLowerCase() : '';
    const filterStr = 'filter' in layer && layer.filter ? JSON.stringify(layer.filter).toLowerCase() : '';
    const layoutStr = layer.layout ? JSON.stringify(layer.layout).toLowerCase() : '';

    // 色キーワードの場合はカラーコードを抽出して判定
    const colorMatches = paintStr.match(/#([0-9a-f]{6}|[0-9a-f]{3})/gi) || [];

    if (["緑", "みどり", "green"].includes(searchLower)) {
        return colorMatches.some(code => isGreenColor(code));
    }
    if (["赤", "あか", "red"].includes(searchLower)) {
        return colorMatches.some(code => isRedColor(code));
    }
    if (["黄", "黄色", "きいろ", "yellow"].includes(searchLower)) {
        return colorMatches.some(code => isYellowColor(code));
    }
    if (["青", "あお", "blue"].includes(searchLower)) {
        return colorMatches.some(code => isBlueColor(code));
    }
    if (["茶", "茶色", "ちゃ", "brown"].includes(searchLower)) {
        return colorMatches.some(code => isBrownColor(code));
    }
    if (["黒", "くろ", "black"].includes(searchLower)) {
        return colorMatches.some(code => isBlackColor(code));
    }
    if (["白", "しろ", "white"].includes(searchLower)) {
        return colorMatches.some(code => isWhiteColor(code));
    }

    return (
        paintStr.includes(searchLower) ||
        filterStr.includes(searchLower) ||
        layoutStr.includes(searchLower)
    );
}
