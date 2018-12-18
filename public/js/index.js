const messages = $('#messages');
const locationBtn = $('#send-location');
const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', ({ from, text }) => {
    console.log('You have new message', { from, text });

    const li = $('<li>');
    li.text(`${from}: ${text}`);
    messages.append(li);
});

socket.on('newLocationMessage', ({ from, url }) => {
    const li = $('<li>');
    const a = $('<a target="_blank">My current location</a>');
    li.text(`${from}: `);
    a.attr('href', url);
    messages.append(li.append(a));
});

$('#message-form').on('submit', e => {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: $('[name="message"]').val()
    }, (data) => {
        console.log('GOT IT!', data);
    });
});

locationBtn.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, err => {
        alert('Unable to fetch location.');
    });
});