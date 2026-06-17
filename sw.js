// sw.js - Tempatkan file ini di root repositori GitHub Pages Anda
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
        const { delay, notifType, title, body } = event.data;
        
        // Memaksa thread hidup sampai janji temu (promise) selesai
        event.waitUntil(
            new Promise((resolve) => {
                setTimeout(() => {
                    const options = {
                        body: body,
                        icon: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=128',
                        vibrate: [200, 100, 200, 100, 200],
                        tag: 'simulasi-web-push',
                        requireInteraction: true,
                        data: { notifType: notifType }
                    };
                    
                    self.registration.showNotification(title, options);
                    
                    // Informasikan balik ke tab browser utama jika tab masih menyala
                    self.clients.matchAll().then((clients) => {
                        clients.forEach((client) => {
                            client.postMessage({
                                type: 'BACKGROUND_FIRED',
                                notifType: notifType
                            });
                        });
                    });

                    resolve();
                }, delay);
            })
        );
    }
});
