import { TinyColor } from "@ctrl/tinycolor";

export const adjustBackgroundColor = (primaryColor: string): string => {
    const color = new TinyColor(primaryColor);
    const brightness = color.getBrightness(); // 明度

    const lightenValue = brightness < 128 ? 48 : 25; // 暗い色はより明るく
    const desaturateValue = brightness < 128 ? 5 : 10; // 暗い色は少し彩度を下げる

    return color.lighten(lightenValue).desaturate(desaturateValue).toString();
};

export const adjustWaterColor = (primaryColor: string): string => {
    const color = new TinyColor(primaryColor);
    const brightness = color.getBrightness();

    const lightenValue = brightness < 128 ? 35 : 10;
    const desaturateValue = brightness < 128 ? 60 : 40;

    return color.lighten(lightenValue).desaturate(desaturateValue).toString();
};

export const adjustRoadColor = (secondaryColor: string): string => {
    const color = new TinyColor(secondaryColor);
    const brightness = color.getBrightness();

    const darkenValue = brightness > 128 ? 10 : 20;
    const desaturateValue = brightness > 128 ? 50 : 30;

    return color.darken(darkenValue).desaturate(desaturateValue).toString();
};