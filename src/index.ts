import L from 'leaflet';
import 'leaflet.heat'

import './style.scss';
// @ts-ignore 
import * as twisto from '../assets/twisto.geojson';
// @ts-ignore 
import * as commerces from '../assets/commerces.geojson';

import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import marker from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (<any>L.Icon.Default.prototype)._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: marker2x,
	iconUrl: marker,
	shadowUrl: markerShadow,
});

window.onload = () => {
	let map: L.Map = L.map('map').setView([49.182863, -0.370679], 11);
	//L.geoJSON(twisto).addTo(map);
	//L.geoJSON(commerces).addTo(map);
	L.heatLayer(commerces.features.map((f: any) => f.geometry.coordinates), { radius: 25, blur: 15 }).addTo(map);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	}).addTo(map);
	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);
};
