
// import leaflet from 'leaflet';
// import SidebarControl from './src/SidebarControl.js';
// import './src/Control.Geocoder.js';

import SidebarControl from './src/SidebarControl.js';
// import SidebarControl from  'scanex-leaflet-sidebar/dist/scanex-leaflet-sidebar.cjs.js';
// import 'scanex-leaflet-sidebar/dist/scanex-leaflet-sidebar.css';

import './src/Control.Geocoder.js';
// import ControlGeocoder from 'leaflet-control-geocoder/dist/Control.Geocoder.js';

import 'leaflet.icon.glyph';
import 'leaflet/dist/leaflet.css';

import Routing from 'leaflet-routing-machine';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import './index.css';

let pars = location.search.substr(1).split('&').reduce((ph, it) => {
	let [key, val] = it.split('=');
	ph[key] = key === 'origin' || key === 'destination' ? val.replace('geo!', '').split(',') : val;
	return ph;
}, {});

let map = L.map(document.body, {zoomControl: false}).setView([54.04, 26.27], 5);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

let ctl = new SidebarControl({position: 'topleft'});
ctl.addTo(map);
// ctl.on('change', e => console.log(e));

let waypoints = [
		L.latLng(pars.origin && pars.origin[0] || 42.904919, pars.origin && pars.origin[1] || -78.882271),
		L.latLng(pars.destination && pars.destination[0] || 43.1558, pars.destination && pars.destination[1] || -77.61632)
	],
	control = L.Routing.control({
		// language: 'ru',
		geocoder: L.Control.Geocoder.nominatim(),
		routeWhileDragging: true,
		reverseWaypoints: true,
		showAlternatives: true,
		altLineOptions: {
			styles: [
				{color: 'black', opacity: 0.15, weight: 9},
				{color: 'white', opacity: 0.8, weight: 6},
				{color: 'blue', opacity: 0.5, weight: 2}
			]
		},
		plan: L.Routing.plan(waypoints, {
			createMarker: function(i, wp) {
				return L.marker(wp.latLng, {
					draggable: true,
					icon: L.icon.glyph({ glyph: String.fromCharCode(65 + i) })
				});
			},
			geocoder: L.Control.Geocoder.nominatim(),
			routeWhileDragging: true
		}),
		router: L.Routing.mapbox('pk.eyJ1Ijoib3JpZ2luYWxzaW4iLCJhIjoiY2ozNW1penM0MDAyZjJ3bndqNXkzaXhybiJ9.52tA0zMKJml-jzNXr4orqw')
	}).on('routesfound', e => {
		// console.log('Routing', e);
		let out = {
			type: e.type,
			waypoints: e.waypoints,
			routes: e.routes
		};
		// fetch('//sveltejs.ru/fetch', {
			// credentials: 'include',
			// method: 'POST',
			// headers: {
				// 'Accept': 'application/json',
				// 'Content-Type': 'application/json'
			// },
			// mode: 'cors',
			// body: JSON.stringify(out)
		// })
		// .then(res => res.json())
		// .then(res => console.log)
		// .catch(err => console.warn(err))

		console.log('Routing', JSON.stringify(out, null, 2));
	}).addTo(map);
/**/

const tabs = [
    // {id: 'layers', icon: 'fas fa-layer-group', opened: 'opened', closed: 'closed', content: 'Layers'},
    // {id: 'services', icon: 'fas fa-cogs', opened: 'opened', closed: 'closed', content: 'Services', enabled: false},
    {id: 'weather', icon: 'fas fa-bolt', opened: 'opened', closed: 'closed', content: control.getContainer()}
];

for (let i = 0; i < tabs.length; ++i) {
    const {id, icon, opened, closed, content, enabled} = tabs[i];
    let p = ctl.addTab({id, icon, opened, closed, enabled});
    // p.innerHTML = `<span>${content}</span>`;
	if (id === 'weather') {
		p.appendChild(control.getContainer());
	}
}
ctl.setCurrent('weather');