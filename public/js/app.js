var socket = io();
var name = getQueryString('name') || 'Guest';
var room = getQueryString('room');

socket.on('connection', function() {
    console.log('Connected to Chattrbox');
});

socket.on('message', function(message) {
    var timestamp = moment.utc(message.timestamp);   
    $('.messages').append('<p><strong>' + message.name + ' ' + timestamp.local().format('h:mm a') +  ': </strong>' + message.text + '</p>');
});

// Handle submit of new messages
var $form = $('#message-form');
$form.on('submit', function(e){
    e.preventDefault();
    
    var $message = $form.find('input[name=message]');
    socket.emit('message', {
        name: name,
        text: $message.val()
    });
    
    $message.val('');
});


function getQueryString(str) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == str) {
            return decodeURIComponent(pair[1]);
        }
    }
    
    return undefined;
}