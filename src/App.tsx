import './App.css'
import FileImporter from './components/FileImporter/FileImporter'
import LayerEditor from './components/LayerEditor/LayerEditor'
import { useState } from 'react'
import { Spin } from 'antd'

function App() {
  const [showLayerEditor, setShowLayerEditor] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleShowLayerEditor = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
      setShowLayerEditor(true);
    }, 100);
  };

  return (
    <>
      <Spin spinning={spinning} tip="styleを読み込んでいます" fullscreen />
      {showLayerEditor ? (
        <LayerEditor />
      ) : (
        <FileImporter onShowLayerEditor={handleShowLayerEditor} />
      )}
    </>
  )
}

export default App