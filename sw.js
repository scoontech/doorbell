self.addEventListener('fetch', (event) => {
    // This allows the app to work offline if you add caching later
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(() => console.log("Service Worker Registered"));
}
