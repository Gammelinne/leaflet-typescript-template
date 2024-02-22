import L from 'leaflet';
import 'leaflet.heat';

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
	iconRetinaUrl: marker,
	iconUrl: marker,
	shadowUrl: markerShadow,
});

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3;
    var φ1 = lat1 * Math.PI / 180;
    var φ2 = lat2 * Math.PI / 180;
    var Δφ = (lat2 - lat1) * Math.PI / 180;
    var Δλ = (lon2 - lon1) * Math.PI / 180;

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var distance = R * c;
    return distance;
}


let commercesData = commerces;

let points = commercesData.features.map(feature => {
    return [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];
});

// Rayon de recherche en mètres
const searchRadius = 50;

// Calculer l'intensité pour chaque point (simplifié)
let intensities = points.map((point, index) => {
    let count = 0;
    points.forEach((otherPoint, otherIndex) => {
        if (index !== otherIndex) {
            let distance = getDistance(point[0], point[1], otherPoint[0], otherPoint[1]);
            if (distance <= searchRadius) {
                count++;
            }
        }
    });
    return [point[0], point[1], count]; // Lat, Lon, Intensité
});

window.onload = () => {
	let map: L.Map = L.map('map').setView([49.182863, -0.370679], 11);

	L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 20,
		attribution:
			'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	}).addTo(map);

	L.heatLayer(intensities, {radius: 25}).addTo(map);
	// L.geoJSON(commerces).addTo(map);

	L.geoJSON(twisto).addTo(map);
};
