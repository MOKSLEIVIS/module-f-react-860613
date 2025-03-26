import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import './App.css'
import { useEffect, useState } from 'react';

import { PlacePage } from './components/PlacePage/PlacePage';

function App() {
  const [data, setData] = useState();
  const [currentPlaceId, setCurrentPlaceId] = useState();

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('https://konkursas.kitm.lt/backend/1434355/api/v1/places', {
        method: 'GET'
      });

      const resp = await response.json();

      setData(resp.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <MapContainer center={[54.6525, 24.9342]} zoom={13} scrollWheelZoom={false} style={{ height: "50vh", width: "100%" }} >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data && data.map((item, index) => (
          <Marker key={index} position={[item.latitude, item.longitude]}>
            <Popup>
              <div className='popup-div'>
                <p>{item.name}</p>
                <p>Lokacija: {item.address}</p>
                <p>Reitingas: {item.rating} / 5</p>
                <button onClick={() => setCurrentPlaceId(item._id)} className='popup-button'>
                  Peržiūrėti vietovę
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {currentPlaceId ? <PlacePage id={currentPlaceId} /> : ''}
    </>
  )
}

export default App
