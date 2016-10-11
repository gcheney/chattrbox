var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static(__dirname + '/public'));

var clients = {}; // store user socket id and info

io.on('connection', function(socket) {  
    
    socket.on('joinRoom', function(req) {
        if (!nameIsAvailable(req.name, req.room)) {
            req.name = 'Guest' + makeGuestId();
        }
        
        clients[socket.id] = req;     
        var name = req.name;
        var room = req.room;
        
        socket.join(room);
        sendCurrentUsers(socket.id, room);
        var text =  name + ' has joined ' + room + '!';
        console.log(text);
        
        socket.broadcast.to(room).emit('message', {
            name: 'System',
            text: text,
            timestamp: moment.valueOf()
        }); 
        
        socket.broadcast.to(room).emit('newUser', {
            name: name
        });
    });
    
    socket.on('disconnect', function() {
        var user = clients[socket.id];
        
        if (typeof user !== 'undefined') {
            var room = user.room;
            var name = user.name;
            socket.leave(room);
            var text = user.name + ' has left ' + room + '.';
            console.log(text);
            
            io.to(room).emit('message', {
                name: 'System',
                text: text,
                timestamp: moment.valueOf()
            });
            
            socket.broadcast.to(room).emit('removeUser', {
                name: name
            });
            
            delete clients[socket.id];
        }
    });
    
    socket.on('message', function(message) {
        var clientRoom = clients[socket.id].room;
        var clientName = clients[socket.id].name;
        console.log('New message from ' + clientName 
                    + '  in ' + clientRoom + ': ' + message.text);
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
    
    function nameIsAvailable(name, room) {
        var isAvailable = true;
        Object.keys(clients).forEach(function(id) {
            var user = clients[id];
            if (user.name === name && user.room === room) {
                isAvailable = false;
            }
        });
        return isAvailable;
    }
    
    function makeGuestId() {
        var id = '';
        var nums = '0123456789';

        for (var i = 0; i < 5; i++) {
            id += nums.charAt(Math.floor(Math.random() * nums.length));
        }

        return id;
    }
    
});

var PORT = process.env.PORT || 3000;
http.listen(PORT, function() {
    console.log('Server is listening on port ' + PORT);
    if (app.get('env') === 'development') {
        console.log('http://127.0.0.1:' + PORT);
    }
});
