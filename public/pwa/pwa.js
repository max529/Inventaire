if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
        // Registration was successful
       
    }, function (err) {
        // registration failed :(
        console.log(err);

    });

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // Stash the event so it can be triggered later.
        window.deferredPrompt = e;
        Inventaire?.PWA?.init();
    });

}