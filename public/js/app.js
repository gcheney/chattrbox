var socket = io();

socket.on('connection', function(){
    console.log('Connected via socket.io');
});