/*
 * These lines should create an IP:port variable to use in the 'naming'
 * of a given connection. On the server side they work - once - and never
 * update after that first time. On client side they are always null.
 */
//var ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address;
//var port = socket.handshake.address.port;
//var username = ip + ":" + port;

var socket = io.connect('http://localhost');

// on connect get username with anonymous callback
socket.on('connect', function() {
  socket.emit('adduser', prompt("Handle: "));
});

// listener for server emitting 'updatechat'
socket.on('updatechat', function(username, data) {
  $('#conversation').append('<b>' + username + ':<b> ' + data + '<br>');
})

// listener for server emitting 'updateusers'
socket.on('updateusers', function(data) {
  $('#users').empty();
  Object.keys(data).forEach( function(name) {
    $('#users').append('<p>' + name + '</p>');
  });
});

// on load of index.html
$(function() {
  $('#datasend').click( function() {
    var message = $('#data').val();
    $('#data').val('');
    socket.emit('sendchat', message);
  });

  $('#disconnect').click( function() {
    socket.disconnect();
  });

  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
    }
  });
});
