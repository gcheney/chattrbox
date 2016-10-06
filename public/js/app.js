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
    var $messageGroup = $('.messages');
    
    var $message = $('<li class="list-group-item"></li>')
    $message.append('<p><strong>' + message.name + ' ' + timestamp.local().format('h:mm a') +  ': </strong>' + message.text + '</p>');  
    $messageGroup.append($message);
    $(window).scrollTo('max');
});

// create current users list for new visitor
socket.on('sendCurrentUsers', function(userData) {
    userData.users.forEach(function(user) {
        var text = '<p id="' + user + '">' + user + '</p>';
        $('.current-users').append(text);
    }); 
});

// Add new users to current users list
socket.on('newUser', function(user) {
    var text ='<p id="' + user.name + '">'  + user.name + '</p></li>';
    $('.current-users').append(text);
});

// Remove user from current users list
socket.on('removeUser', function(user) {
    var target = '#' + user.name;
    $(target).remove();
});


// confirm navigation to new chat room
$('#change-rooms').on('click', function(e) {
    return confirm('Are you sure you want to leave this chatroom?');
});

// get message form and message input
var $messageForm = $('#message-form');
var $messageInput = $messageForm.find('input[name=message]');

// check for message typing
$messageInput.keypress(function(e) {
    var input = String.fromCharCode(e.keyCode);
    if (/[a-zA-Z0-9-_ ]/.test(input)) {
        $messageInput.removeClass('message-error');
    }
});

// Handle validation and submit of new messages
$messageForm.on('submit', function(e) {
    e.preventDefault();
    
    // check for message
    if (isBlankOrEmpty($messageInput.val())) {
        $messageInput.addClass('message-error');
        return;
    }
    
    socket.emit('message', {
        name: name,
        text: $messageInput.val()
    });
    
    $messageInput.val('');
});

// check for escape button
$(document).keyup(function(e) {
     if (e.keyCode == 27) { 
        var leaveChatroom = confirm('Are you sure you want to leave this chatroom?');
        if (leaveChatroom) {
            window.location.href = '/index.html';
        }
    }
});

// check for string content
function isBlankOrEmpty(str) {
    return (!str || 0 === str.length || /^\s*$/.test(str));
}

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