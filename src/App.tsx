import './App.css'
import FileImporter from './components/FileImporter/FileImporter'
import LayerEditor from './components/LayerEditor/LayerEditor'
import { useState } from 'react'

function App() {
  const [showLayerEditor, setShowLayerEditor] = useState(false);

  return (
    <div>
      {showLayerEditor ? (
        <LayerEditor />
      ) : (
        <FileImporter onShowLayerEditor={() => setShowLayerEditor(true)} />
      )}
    </div>
  )
}

export default App