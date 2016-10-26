$(document).ready(function() {
    // validate join chat form 
    var $joinForm = $('#join-form');
    $joinForm.on('submit', function(e) {
        var $nameInput = $('#name-input');
        var $roomInput = $('#room-input');

        //hide old validation messages
        $('.text-danger').hide();
        $nameInput.removeClass('validation-error');
        $roomInput.removeClass('validation-error');

        //check for validation success
        var validtionSuccess = true;
        if (!$nameInput.val()) {
            $nameInput.addClass('validation-error');
            $joinForm.prepend('<ul class="text-danger" id="name-val-msg"><li>Please create a display name</li></ul>');
            validtionSuccess = false;
        }              
        if (!$roomInput.val()) {
            $roomInput.addClass('validation-error');
            $joinForm.prepend('<ul class="text-danger" id="room-val-msg"><li>Please enter the chat room name</li></ul>');
            validtionSuccess = false;
        }

        return validtionSuccess;
    });
    
    $('#name-input').keypress(function(e) {
        $('#name-input').removeClass('validation-error');
        $('#name-val-msg').remove();
    });
    
    $('#room-input').keypress(function(e) {
        $('#room-input').removeClass('validation-error');
        $('#room-val-msg').remove();
    });
});