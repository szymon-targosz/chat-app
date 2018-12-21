const messages = $('#messages');
const locationBtn = $('#send-location');
const socket = io();

const scrollToBottom = () => {
    const newMessage = messages.children('li:last-child');

    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
};

socket.on('connect', () => {
    const params = $.deparam(window.location.search);

    socket.emit('join', params, err => {
        if (err) {
            alert('Name and room are required.');
            location.assign('/');
        } else {
            console.log('no error');
        }
    })
});

socket.on('newMessage', ({ from, text, createdAt }) => {
    const formattedTime = moment(createdAt).format('h:mm a');
    const template = $('#message-template').html();
    const html = Mustache.render(template, { from, text, formattedTime });
    messages.append(html);
    scrollToBottom();
});

socket.on('newLocationMessage', ({ from, url, createdAt }) => {
    const formattedTime = moment(createdAt).format('h:mm a');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, { from, url, formattedTime });
    messages.append(html);
    scrollToBottom();
});

socket.on('updateUsersList', users => {
    const ol = $('<ol>');
    users.forEach(user => {
        ol.append($('<li>').text(user));
    });
    $('#users').html(ol);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
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