var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clients = {}; // store user socket id and info

io.on('connection', function(socket) {  
    
    socket.on('joinRoom', function(req) {
        clients[socket.id] = req;     
        var name = req.name;
        var room = req.room;
        
        socket.join(room);
        var text =  name + ' has joined ' + room + '!';
        console.log(text);
        
        socket.broadcast.to(room).emit('message', {
            name: 'System',
            text: text,
            timestamp: moment.valueOf()
        }); 
        
        sendCurrentUsers(socket.id, room);
    });
    
    socket.on('disconnect', function() {
        var user = clients[socket.id];
        
        if (typeof user !== 'undefined') {
            socket.leave(user.room);
            var text = user.name + ' has left ' + user.room + '.';
            console.log(text);
            
            io.to(user.room).emit('message', {
                name: 'System',
                text: text,
                timestamp: moment.valueOf()
            });
            delete clients[socket.id];
        }
    });
    
    socket.on('message', function(message) {
        var clientRoom = clients[socket.id].room;
        console.log('New message in ' + clientRoom + ': ' + message.text);
        message.timestamp = moment.valueOf();
        io.to(clientRoom).emit('message', message);
    });

    // initial server message
    socket.emit('message', {
        name: 'Server',
        text: 'Welcome to Chattrbox!',
        timestamp: moment.valueOf()
    });
    
    function sendCurrentUsers(socketid, room) {
        var users = [];

        Object.keys(clients).forEach(function(id) {
            var user = clients[id];
            if (user.room === room) {
                users.push(user.name);
            }
        });
        
        io.to(socketid).emit('sendCurrentUsers', {
           users: users 
        });
    }
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
    console.log('Server is listening on port ' + PORT);
});
