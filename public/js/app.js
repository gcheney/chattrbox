var socket = io();

socket.on('connection', function(){
    console.log('Connected via socket.io');
});

socket.on('message', function(message){
    console.log('New message: ' + message.text);
});