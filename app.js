var app		= require('express')(),
	server 	= require('http').createServer(app),
	io		= require('socket.io').listen(server),
	ent		= require('ent'),		// htmlentities
	// mysql 	= require('mysql'),
	fs 		= require('fs');

app.set('view engine', 'ejs');
app.set('views', __dirname+"/views");

var dir = __dirname;


app.get('/', function(req, res) {
	// res.setHeader('Content-Type', 'text/html');
	res.render('index', {dir: dir});
});


server.listen(8080);