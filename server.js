var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

// Handle routing for app
app.get('/', function(request, response) {
  response.sendfile(__dirname + '/index.html');
  console.log(request.socket.address());
});

app.get('/client.js', function(request, response) {
  response.sendfile(__dirname + '/client.js');
});

// global variable to hold the usernames of every client
var usernames = {};

io.sockets.on('connection', function(socket) {
  var room = socket.handshake.address;
  console.log("User connected from: " + room);

  socket.join(room);

  // listen for client to 'sendchat'
  socket.on('sendchat', function(data) {
    io.sockets.in(room).emit('updatechat', socket.username, data);
  });

  // listen for client to 'adduser'
  socket.on('adduser', function(username) {
    socket.username = username;
    socket.emit('updatechat', 'SERVER', ' connected');
    socket.broadcast.to(room).emit('updatechat', 'SERVER', username + ' has connected');
    io.sockets.in(room).emit('updateusers', usernames);
  });

  // listen for client to 'disconnect'
  socket.on('disconnect', function() {
    delete usernames[socket.username];
    io.sockets.in(room).emit('updateusers', usernames);
    socket.broadcast.to(room).emit('updatechat', 'SERVER', socket.username + ' has disconnected');
  });
});
