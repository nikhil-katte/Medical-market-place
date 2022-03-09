console.log("DLD SW LOADED");

import {registerRoute} from 'workbox-routing';
import {CacheableResponsePlugin} from 'workbox-cacheable-response';
import {CacheFirst} from 'workbox-strategies';
import {ExpirationPlugin} from 'workbox-expiration';
import {StaleWhileRevalidate} from 'workbox-strategies';

registerRoute(
    ({request}) => request.destination === 'script' ||
        request.destination === 'style',
    new StaleWhileRevalidate()
);

registerRoute(
    ({request}) => request.destination === 'html' ||
        request.destination === 'document',
    new StaleWhileRevalidate()
);

// registerRoute(
//     ({request}) => request.destination === 'image',
//     new CacheFirst({
//         cacheName: 'images',
//         plugins: [
//             new CacheableResponsePlugin({
//                 statuses: [0, 200],
//             }),
//             new ExpirationPlugin({
//                 maxEntries: 120,
//                 maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
//             }),
//         ],
//     }),
// );