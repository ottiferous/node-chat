var socket = io.connect('http://localhost');

// on connect get username with anonymous callback
socket.on('connect', function() {
  socket.emit('adduser', prompt("Handle: "));
});

// listener for server emitting 'updatechat'
socket.on('updatechat', function(username, data) {
  $('#conversation').append('<b>' + username + ':<b> ' + data + '<br>');
})
// lsitener for server emitting 'updateusers'
socket.on('updateusers', function(data) {
  $('#users').empty();
  $.each(data, function(key, value) {
    $('#users').append('<div>' + key + '</div>');
  });
});

// on load of index.html
$(function() {
  $('#datasend').click( function() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
  });

  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });
});
