import { useMap } from 'react-leaflet'
import L, { Marker } from 'leaflet'
// import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import React, { useEffect, useState } from 'react'

// eslint-disable-next-line no-undef
const intervals: NodeJS.Timer[] = []
let currentCoordinates: L.LatLng[] = []
const pointMarkers: Marker[] = []
const carIcon = L.icon({ iconUrl: 'car.png', iconSize: [25, 25] })
const dashIcon = L.icon({
  iconUrl: 'point.png',
  iconSize: [5, 5],
})
let carMarker: Marker | null

function Navigation() {
  const map = useMap()
  const [toggle, setToggle] = useState(false)

  const [waypoints, setWaypoints] = useState([
    new L.Routing.Waypoint(L.latLng(35.734298, 51.303879), 'start', {}),
    new L.Routing.Waypoint(L.latLng(35.714298, 51.383879), 'end', {}),
  ])
  const instance = L.Routing.control({
    waypoints,
  })
  instance.addTo(map)
  toggleCoordinates(toggle, map)

  useEffect(() => {
    return () => {
      setWaypoints(instance.getWaypoints())
    }
  }, [])

  instance.on('routesfound', (e) => {
    const routes: L.Routing.IRoute[] = e.routes
    resetOldRoutes()
    onRoutesFound(routes[0].coordinates, map)
  })
  return (
    <div className="menubar">
      <button
        onClick={() => {
          setToggle(!toggle)
        }}
      >
        {toggle ? 'Hide Points' : 'Show Points'}
      </button>
    </div>
  )
}
function onRoutesFound(coordinates: L.LatLng[] | undefined, map: L.Map) {
  let i = 0

  const interval = setInterval(() => {
    if (!coordinates) {
      return
    }
    currentCoordinates = coordinates
    if (i === coordinates.length - 1) {
      clearInterval(interval)
    }
    if (!carMarker) {
      carMarker = new L.Marker(coordinates[0], { icon: carIcon }).addTo(map)
    } else {
      carMarker.setLatLng(coordinates[i])
    }
    i++
  }, 200)
  intervals.push(interval)
}
function resetOldRoutes() {
  intervals.forEach((interval) => clearInterval(interval))
}
function toggleCoordinates(toggle: boolean, map: L.Map) {
  if (toggle) {
    currentCoordinates.forEach((point) => {
      const pointMarker = new L.Marker(point, { icon: dashIcon }).addTo(map)
      pointMarkers.push(pointMarker)
    })
  } else {
    pointMarkers.forEach((marker) => marker.remove())
  }
}
export default Navigation
