var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var userInfo = {};

io.on('connection', function(socket) {  
    console.log('Connected to Chattrbox');
    
    socket.on('joinRoom', function(req) {
        console.log('Here!');
        userInfo[socket.id] = req;      
        socket.join(req.room);
        var text =  req.name + ' has joined ' + req.room + '!';
        console.log(text);
        socket.broadcast.to(req.room).emit('message', {
            name: 'System',
            text: text,
            timestamp: moment.valueOf()
        }); 
    });
    
    socket.on('message', function(message) {
        var clientRoom = userInfo[socket.id].room;
        console.log('New message in ' + clientRoom + ': ' + message);
        message.timestamp = moment.valueOf();
        io.to(clientRoom).emit('message', message);
    });

    // initial server message
    socket.emit('message', {
        name: 'Server',
        text: 'Welcome to Chattrbox!',
        timestamp: moment.valueOf()
    });
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, function(){
    console.log('Server is listening on port ' + PORT);
});
