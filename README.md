# Dubai Transport Accessibility Score

A public **PHP + JavaScript microSPA** demo of a geospatial scoring model for evaluating transport accessibility of Dubai buildings.

The repository intentionally contains only a small sanitized dataset. Production building geometry, Makani identifiers, detailed incident records, and private source datasets are not included.

## What the demo shows

- building-level transport accessibility scores;
- qualitative score levels (`low`, `medium`, `high`);
- traffic accident-rate overlay;
- interactive Mapbox visualization;
- popup inspection of demo buildings;
- a reproducible PHP utility for creating a sanitized 100-building sample from a local GeoJSON source.

## Stack

- PHP
- Vanilla JavaScript
- Mapbox GL JS
- GeoJSON
- CSS

No framework is required.

## Repository structure

```text
.
├── index.php
├── assets/
│   ├── app.css
│   ├── app.js
│   ├── config.example.js
│   └── config.js          # local only, ignored by Git
├── data/
│   └── tas-dubai-sample.geojson
├── .gitignore
└── README.md
```

## Run locally

1. Copy the example config:

```bash
cp assets/config.example.js assets/config.js
```

2. Add your own Mapbox **public** token to `assets/config.js`.

3. Start the built-in PHP server:

```bash
php -S localhost:8080
```

4. Open `http://localhost:8080`.

## Creating the 100-building public sample

The full production GeoJSON must stay outside the public repository.

Place it locally at:

```text
private/buildings_traffic_accident_rate_transport_accessibility_score.geojson
```

Then run:

```bash
```

The script:

- reads the large GeoJSON as a stream instead of decoding the entire file into PHP memory;
- selects the 100 buildings nearest to the configured center point;
- removes `makani_number`;
- removes detailed `registered_traffic_incidents`;
- assigns public IDs such as `DEMO_001`;
- writes `data/tas-dubai-sample.geojson`.


```php
$centerLat = 25.1865;
$centerLon = 55.2645;
$limit = 100;
```

## Data policy

This repository is a portfolio showcase, not a distribution channel for Smart Indexes production datasets.

Not published:

- complete Dubai building geometry dataset;
- Makani identifiers;
- production source files;
- detailed incident history;
- private Mapbox configuration;
- internal Smart Indexes APIs or credentials.

The included GeoJSON is a sanitized demo dataset intended for public showcase use.

## About Smart Indexes

Smart Indexes develops geospatial analytics and property-market tools for Dubai.

Website: https://smartindexes.com/

## License

No open-source license is included. Unless a license is added later, the repository is provided as a public portfolio showcase and all rights remain reserved by the copyright holder. Data rights are separate from source-code rights.
