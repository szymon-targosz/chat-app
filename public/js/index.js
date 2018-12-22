const socket = io();

socket.on('rooms', rooms => {
    if (rooms.length > 0) {
        rooms.forEach(room => {
            $('#rooms').append($('<option>').attr('value', room));
        });
    }
});
