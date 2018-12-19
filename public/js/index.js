const messages = $('#messages');
const locationBtn = $('#send-location');
const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', ({ from, text, createdAt }) => {
    const formattedTime = moment(createdAt).format('h:mm a');
    const li = $('<li>');
    li.text(`${from} ${formattedTime}: ${text}`);
    messages.append(li);
});

socket.on('newLocationMessage', ({ from, url, createdAt }) => {
    const formattedTime = moment(createdAt).format('h:mm a');
    const li = $('<li>');
    const a = $('<a target="_blank">My current location</a>');
    li.text(`${from} ${formattedTime}: `);
    a.attr('href', url);
    messages.append(li.append(a));
});

$('#message-form').on('submit', e => {
    e.preventDefault();
    const msgInp = $('[name="message"]');

    socket.emit('createMessage', {
        from: 'User',
        text: msgInp.val()
    }, () => {
        msgInp.val('');
    });
});

locationBtn.on('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationBtn.attr('disabled', true).text('Sending...');

    navigator.geolocation.getCurrentPosition(position => {
        locationBtn.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, err => {
        locationBtn.removeAttr('disabled').text('Send location');
        alert('Unable to fetch location.');
    });
});