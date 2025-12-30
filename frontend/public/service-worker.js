self.addEventListener('push', function (event) { //ascolta quando il browser riceve una notifica dal server
    const data = event.data.json(); //la notifica ricevuta dal server viene convertita in json
    self.registration.showNotification(data.title, { //mostra la notifica
        body: data.body,
        icon: '/notification.png'
    });
});
