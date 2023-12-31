import { useMap } from 'react-leaflet'
import L, { Marker } from 'leaflet'
// import { createControlComponent } from '@react-leaflet/core'
import 'leaflet-routing-machine'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import React, { useEffect, useState } from 'react'

// eslint-disable-next-line no-undef
const intervals: NodeJS.Timer[] = []
let currentCoordinates: L.LatLng[] | undefined = []
const pointMarkers: Marker[] = []
const carIcon = L.icon({ iconUrl: 'navigation.png', iconSize: [25, 25] })
const dashIcon = L.icon({
  iconUrl: 'point.png',
  iconSize: [8, 8],
})
let carMarker: Marker | null
let lastIndex: number = 0

function Navigation() {
  const map = useMap()
  const [toggle, setToggle] = useState(false)
  const [index, setIndex] = useState(0)
  const [isPlay, setPlay] = useState(true)
  const waypoints = [
    new L.Routing.Waypoint(L.latLng(35.734298, 51.303879), 'start', {}),
    new L.Routing.Waypoint(L.latLng(35.684298, 51.423879), 'end', {}),
  ]

  const instance = L.Routing.control({
    waypoints,
  })
  instance.addTo(map)

  toggleCoordinates(toggle, map)

  useEffect(() => {
    return () => {
      setIndex(lastIndex)
    }
  }, [isPlay])

  instance.on('routesfound', (e) => {
    const routes: L.Routing.IRoute[] = e.routes
    currentCoordinates = routes[0].coordinates
    resetOldRoutes()
    onRoutesFound(routes[0].coordinates, map, index, isPlay)
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
      <button
        onClick={() => {
          setPlay(!isPlay)
        }}
      >
        {isPlay ? 'pause' : 'play'}
      </button>
    </div>
  )
}
function onRoutesFound(
  coordinates: L.LatLng[] | undefined,
  map: L.Map,
  index: number,
  isPlay: boolean
) {
  let i = index

  const interval = setInterval(() => {
    if (!coordinates || !isPlay) {
      return
    }

    if (i === coordinates.length - 1) {
      clearInterval(interval)
    }
    if (!carMarker) {
      carMarker = new L.Marker(coordinates[i], { icon: carIcon }).addTo(map)
    } else {
      carMarker.setLatLng(coordinates[i])
      map.setView(coordinates[i])
    }
    i++
    lastIndex = i
  }, 200)
  intervals.push(interval)
}
function resetOldRoutes() {
  intervals.forEach((interval) => clearInterval(interval))
}
function toggleCoordinates(toggle: boolean, map: L.Map) {
  if (toggle) {
    currentCoordinates?.forEach((point) => {
      const pointMarker = new L.Marker(point, { icon: dashIcon }).addTo(map)
      pointMarkers.push(pointMarker)
    })
  } else {
    pointMarkers.forEach((marker) => marker.remove())
  }
}
export default Navigation
