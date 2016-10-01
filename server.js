var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    console.log('Connected via socket.io');
    
    socket.on('message', function(message) {
        console.log('Message received: ' + message.text);
        socket.broadcast.emit('message', message);
    });
    
    socket.emit('message', {
        text: 'It\'s chatting time'
    });
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, function(){
    console.log('Server is listening on port ' + PORT);
});