var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

// Hande routing for app
app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html');
});

app.get('/client.js', function(request, response) {
  response.sendfile(__dirname + '/client.js');
});

// global variable to hold the usernames of every client
var usernames = {};

/*
 * this section handles all the possible events once a 'connection' has been
 * established to our socket.io server. At a minimum we will need to handle a
 * user joining, sending a chat, and disconnecting from our server.
*/
io.sockets.on('connection', function(socket) {
  console.log("User connected");

  // listen for client to 'sendchat'
  socket.on('sendchat', function(data) {
    io.sockets.emit('updatechat', socket.username, data);
  });

  // listen for client to 'adduser'
  socket.on('adduser', function(username) {
    socket.username = username;
    usernames[username] = username;
    socket.emit('updatechat', 'SERVER', ' connected');
    socket.broadcast.emit('updatechat', 'SERVER', username + ' has connected');
    io.sockets.emit('updateusers', usernames);
  });

  // listen for client to 'disconnect'
  socket.on('disconect', function() {
    delete usernames[socket.username];
    io.sockets.emit('updateusers', usernames);
    socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
