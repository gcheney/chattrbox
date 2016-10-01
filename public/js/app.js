var socket = io();

socket.on('connection', function(){
    console.log('Connected via socket.io');
});

socket.on('message', function(message){
    console.log('New message: ' + message.text);
    
    $('.messages').append('<p>' + message.text + '</p>');
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