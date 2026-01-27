self.addEventListener('push', function (event) {// Listen for push events sent from the server
    const data = event.data.json(); // Parse the incoming push message data as JSON
    self.registration.showNotification(data.title, { // Show a notification to the user
        body: data.body,
        icon: './images/notification.png'
    });
});
