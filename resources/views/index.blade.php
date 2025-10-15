<?php $version = "1.0.0"; ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#dcdcdc" />
    <title>Inventaire FC Vétroz</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/css/default.css?v=<?= $version ?>">
    <link rel="shortcut icon" href="/img/logo.png" type="image/png">
    <script src="/pwa/pwa.js"></script>
    <script src="/inventaire.js?v=<?= $version ?>"></script>
    <link rel="manifest" href="/pwa/manifest.json" />
</head>

<body>
    <av-main></av-main>
</body>

</html>