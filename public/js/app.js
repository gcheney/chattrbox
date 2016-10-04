var socket = io();
var name = getQueryString('name') || 'Guest';
var room = getQueryString('room');

// dynamically set room name
$('.room-name').text(room);

// on connection - join room
socket.on('connect', function() {
    socket.emit('joinRoom', {
        name: name, 
        room: room
    });
});

// when message is received
socket.on('message', function(message) {
    var timestamp = moment.utc(message.timestamp);   
    $('.messages').append('<p><strong>' + message.name + ' ' + timestamp.local().format('h:mm a') +  ': </strong>' + message.text + '</p>');
});

// create current users list for new visitor
socket.on('sendCurrentUsers', function(userData) {
    userData.users.forEach(function(user) {
        var text = '<p id="' + user + '">' + user + '</p>'
        $('.current-users').append(text);
    }); 
});

// Add new users to current users list
socket.on('newUser', function(user) {
    var text = '<p id="' + user.name + '">' + user.name + '</p>'
    $('.current-users').append(text);
});

// Remove user from current users list
socket.on('removeUser', function(user) {
    var target = '#' + user.name;
    $(target).remove();
});

// Handle submit of new messages
var $form = $('#message-form');
$form.on('submit', function(e) {
    e.preventDefault();
    
    var $message = $form.find('input[name=message]');
    socket.emit('message', {
        name: name,
        text: $message.val()
    });
    
    $message.val('');
});

// parse query strings
function getQueryString(str) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == str) {
            return decodeURIComponent(pair[1].replace(/\+/g, ' '));
        }
    }
    
    return undefined;
}