(() => {
    'use strict';

    const DATA_URL = 'data/tas-dubai-sample.geojson';
    const token = window.APP_CONFIG?.MAPBOX_TOKEN || '';

    if (!token) {
        document.body.insertAdjacentHTML(
            'beforeend',
            '<div style="position:fixed;inset:auto 12px 12px 12px;z-index:20;padding:12px 14px;background:#fff;color:#111;border-radius:4px;font:13px system-ui">Add your Mapbox public token to <b>assets/config.js</b>.</div>'
        );
        return;
    }

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [55.2645, 25.1865],
        zoom: 14.2,
        pitch: 25,
        bearing: 0
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const modes = {
        accessibility: {
            title: 'Transport Accessibility Score',
            property: 'transport_accessibility_score',
            fill: [
                'case',
                ['has', 'transport_accessibility_score_fill_color'],
                ['get', 'transport_accessibility_score_fill_color'],
                '#8c8c8c'
            ],
            legend: [
                ['#c2e699', 'Low', '< 40'],
                ['#78c679', 'Medium', '40–60'],
                ['#31a354', 'High', '> 60']
            ]
        },
        traffic: {
            title: 'Traffic Accident Rate',
            property: 'traffic_accident_rate',
            fill: [
                'case',
                ['has', 'traffic_accident_rate_fill_color'],
                ['get', 'traffic_accident_rate_fill_color'],
                '#8c8c8c'
            ],
            legend: [
                ['#fff7bc', 'Minimum', 'lower rate'],
                ['#fec44f', 'Medium', 'moderate rate'],
                ['#d95f0e', 'High', 'higher rate']
            ]
        }
    };

    let currentMode = 'accessibility';

    function renderLegend(mode) {
        const config = modes[mode];
        const html = config.legend.map(([color, label, range]) => `
            <div class="row">
                <span class="sw" style="background:${color}"></span>
                <span><i>${label}</i><em>${range}</em></span>
            </div>
        `).join('');

        document.getElementById('legend').innerHTML = `<h3>${config.title}</h3>${html}`;
    }

    function setMode(mode) {
        if (!modes[mode]) return;
        currentMode = mode;

        document.querySelectorAll('.controls button').forEach(button => {
            button.classList.toggle('selected', button.dataset.mode === mode);
        });

        if (map.getLayer('buildings-fill')) {
            map.setPaintProperty('buildings-fill', 'fill-color', modes[mode].fill);
        }

        renderLegend(mode);
    }

    map.on('load', async () => {
        const response = await fetch(DATA_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`GeoJSON load failed: ${response.status}`);

        const geojson = await response.json();

        map.addSource('demo-buildings', {
            type: 'geojson',
            data: geojson
        });

        map.addLayer({
            id: 'buildings-fill',
            type: 'fill',
            source: 'demo-buildings',
            paint: {
                'fill-color': modes.accessibility.fill,
                'fill-opacity': 0.72
            }
        });

        map.addLayer({
            id: 'buildings-outline',
            type: 'line',
            source: 'demo-buildings',
            paint: {
                'line-color': '#ffffff',
                'line-opacity': 0.32,
                'line-width': 0.8
            }
        });

        const bounds = new mapboxgl.LngLatBounds();
        geojson.features.forEach(feature => {
            const geometry = feature.geometry;
            const rings = geometry.type === 'Polygon'
                ? geometry.coordinates
                : geometry.type === 'MultiPolygon'
                    ? geometry.coordinates.flat()
                    : [];

            rings.flat().forEach(coord => bounds.extend(coord));
        });

        if (!bounds.isEmpty()) {
            map.fitBounds(bounds, { padding: 70, maxZoom: 16 });
        }

        map.on('click', 'buildings-fill', event => {
            const feature = event.features?.[0];
            if (!feature) return;

            const p = feature.properties || {};
            const score = p.transport_accessibility_score ?? '—';
            const scoreLevel = p.transport_accessibility_score_level ?? '—';
            const traffic = p.traffic_accident_rate ?? '—';
            const trafficLevel = p.traffic_accident_rate_level ?? '—';
            const buildingId = p.building_id ?? 'Demo building';

            new mapboxgl.Popup()
                .setLngLat(event.lngLat)
                .setHTML(`
                    <h2>${buildingId}</h2>
                    <p><b>Accessibility score</b><br>${score} · ${scoreLevel}</p>
                    <p><b>Traffic accident rate</b><br>${traffic} · ${trafficLevel}</p>
                `)
                .addTo(map);
        });

        map.on('mouseenter', 'buildings-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', 'buildings-fill', () => { map.getCanvas().style.cursor = ''; });

        renderLegend(currentMode);
    });

    document.querySelectorAll('.controls button').forEach(button => {
        button.addEventListener('click', () => setMode(button.dataset.mode));
    });
})();
