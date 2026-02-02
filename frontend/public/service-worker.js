/*
  Push notification handler:
  Listens for incoming push events from the server and displays notifications to the user.
*/

// Display notifications to the user
self.addEventListener('push', function (event) {
    const data = event.data.json();
    self.registration.showNotification(data.title, { // Show a notification to the user
        body: data.body,
        icon: './images/notification.png'
    });
});
