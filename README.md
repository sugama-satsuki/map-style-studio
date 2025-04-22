# map-style-creater
A React component for creating map styles.
mapのstyleを作成するreactコンポーネントです。

## Features
- 用意した地図スタイルをカスタマイズできます
- 変更した地図スタイルをダウンロードできます
- 変更した地図スタイルを関数にて取得できます

## Usage
1. rectで使用する方法
```
const Demo = () => {

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [mapStyle, setMapStyle] = useState<StyleSpecification | undefined>(undefined);
  const [map, setMap] = useState<maplibregl.Map | null>(null);

  // 
  const onChangeMapStyle = (newMapStyle: StyleSpecification | undefined) => {
    if(!map || !newMapStyle) { return; }
    map?.setStyle(newMapStyle);
  };

  useEffect(() => {
    if (!mapContainerRef.current) { return; }
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://smartmap.styles.geoloniamaps.com/style.json",
      center: [139.6917, 35.6895],
      zoom: 10
    });

    map.on('load', () => {
      setMap(map);
      setMapStyle(map.getStyle());
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="layout">
      <div className="layout__map-area" ref={mapContainerRef}>
      </div>
      <div className="layout__form-area">
        <MapStyleCreator mapStyle={mapStyle} onChange={onChangeMapStyle} />
      </div>
    </div>
  );
};
```

2. `@geolonia/embed` で書き出したstyleを使用する方法（検討中。ここじゃなくて@geolonia/embedのREADMEに記述すべき？）
```
<!DOCTYPE html>
<html>
  <body>
    <div 
      class="geolonia" 
      data-key="YOUR-API-KEY"
      style="YOUR-STYLE-URL"
    ></div>
    <script src="https://cdn.geolonia.com/v1/embed"></script>
  </body>
</html>
```


## スタイルの命名（どこまで決めるか）

- 道路（Roads）
  - road-primary: 主幹道路（国道）
  - road-primary-highway: 主幹道路（高速道路）
  - road-secondary: 二次道路（県道、市道など）
  - road-tertiary: 三次道路（小道、農道など）
  - road-outline: 道路の外枠（境界線）
- 鉄道の線路（Railway Tracks）
  - railway-main: 主な鉄道路線（主要幹線や高速鉄道など）
  - railway-secondary: 二次鉄道路線（地方鉄道や支線など）
  - railway-outline: 鉄道路線の外枠（線路の境界線）
- 鉄道駅（Railway Stations）
  - railway-station: 鉄道駅のポイント
  - railway-station-label: 駅名ラベル
- 背景（Background）
  - background-default: デフォルトの背景色
  - background-urban: 都市部の背景
  - background-rural: 農村部の背景
- 建物（Buildings）
  - building-default: 一般建物
  - building-highlight: 強調表示された建物（例: 重要施設）
  - building-outline: 建物の外枠
- 水域（Water）
  - water-default: 一般的な水域（海、湖、川など）
  - water-outline: 水域の外枠
  - water-depth: 水深を表すレイヤー
- 山（Mountains）
  - mountain-contour: 等高線
  - mountain-peak: 山頂のポイント
  - mountain-shadow: 山の影
- 野原（Fields/Grasslands）
  - field-default: 一般的な野原
  - field-agriculture: 農地
  - ield-forest: 森林エリア

### オリジナルのレイヤー名を指定したい場合（未対応）
以下を指定することで、変更できます。
```
const layerOption = {
  "road-primary": ORIGINAL-ROAD-PRIMARY-NAME,
  ...
}

<MapStyleCreator 
  mapStyle={mapStyle} 
  onChange={onChangeMapStyle}
  layerOption={layerOption}
/>
```
