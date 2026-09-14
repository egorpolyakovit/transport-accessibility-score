<?php
?><!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dubai Transport Accessibility Score — Smart Indexes</title>
    <meta name="description" content="Public demo of a transport accessibility scoring model for Dubai buildings.">

    <link href="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.css" rel="stylesheet">
    <link rel="stylesheet" href="assets/app.css?v=1">
</head>
<body>
    <div id="map" aria-label="Dubai transport accessibility map"></div>

    <section class="panel" aria-label="Map controls">
        <h1>Dubai Transport Accessibility Score</h1>
        <div class="controls">
            <button type="button" class="selected" data-mode="accessibility">Accessibility</button>
            <button type="button" data-mode="traffic">Traffic accident rate</button>
        </div>
    </section>

    <aside id="legend" aria-label="Legend"></aside>

    <a id="logo" href="https://smartindexes.com/" target="_blank" rel="noopener noreferrer" aria-label="Smart Indexes">
        <span>SMART INDEXES</span>
    </a>

    <script src="https://api.mapbox.com/mapbox-gl-js/v3.14.0/mapbox-gl.js"></script>
    <script src="assets/config.js"></script>
    <script src="assets/app.js?v=1"></script>
</body>
</html>
