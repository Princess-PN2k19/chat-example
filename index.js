var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express = require('express');

var clients = [];
var incr = 1;

function getUsersList(){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n;
    }
  return usersList;
}

function setUserTyping(index){
  var usersList = [];
    for (var i = 0; i < clients.length; i++){
      usersList[i] = clients[i].n; 
    }
  usersList[index] = clients[index].n + " is typing 💬 " ;
  return usersList;
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  clients.push(socket);

  socket.on('start', function(){
    socket.emit('name', "guest"+incr);
    clients[clients.indexOf(socket)].n = "guest" + incr;
    incr++;
    io.emit('users list', getUsersList());
  });

  socket.on('send chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('set name', function(nick){
    io.emit('info', "New user: " + nick);
    clients[clients.indexOf(socket)].n = nick;
    io.emit('users list', getUsersList());
  });

  socket.on('typing', function(){
    io.emit('typing signal', setUserTyping(clients.indexOf(socket)));
  });

  socket.on('not typing', function(){
    io.emit('typing signal', getUsersList());
  });

  socket.on('disconnect', function() {
    if( clients[clients.indexOf(socket)].n == null ){
    }
    else{
      io.emit('info', "User " + clients[clients.indexOf(socket)].n + " disconnected.");
    }
    clients.splice(clients.indexOf(socket),1);
    io.emit('users list', getUsersList());
   });
});

http.listen(3000, function(){
  console.log("listening on localhost:3000");
});