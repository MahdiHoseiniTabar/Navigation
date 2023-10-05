import './App.css'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import Navigation from './navigation'

function App() {
  return (
    <div className="App">
      <MapContainer
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: '100vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Navigation />
      </MapContainer>
    </div>
  )
}

export default App
