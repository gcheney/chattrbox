var socket = io();

socket.on('connection', function() {
    console.log('Connected to Chattrbox');
});

socket.on('message', function(message) {
    var timestamp = moment.utc(message.timestamp);    
    $('.messages').append('<p><strong>' 
                            + timestamp.local().format('h:mm a') 
                            +  ': </strong>' + message.text + '</p>');
});

// Handle submit of new messages
var $form = $('#message-form');
$form.on('submit', function(e){
    e.preventDefault();
    
    var $message = $form.find('input[name=message]');
    socket.emit('message', {
        text: $message.val()
    });
    
    $message.val('');
});