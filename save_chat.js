var app = require('express')(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	ent = require('ent'),		// htmlentities
	mysql = require('mysql'),
	fs = require('fs'),
	connection = mysql.createConnection({
		host	 : 	'localhost',
		user	 : 	'root',
		password :  'root',
		port 	 : 	'8080'
	});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});


app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket, pseudo) {

	socket.on('nouveau_client', function(pseudo) {
		pseudo = ent.encode(pseudo);
		socket.pseudo = pseudo;
		socket.broadcast.emit('nouveau_client', pseudo);
	});

	socket.on('message', function(message) {
		message = ent.encode(message);
		socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message});
	});
});


server.listen(8080);