var express = require('express'),
	app		= express(),
	server 	= require('http').createServer(app),
	io		= require('socket.io').listen(server),
	ent		= require('ent'),		// htmlentities
	mysql 	= require('mysql'),
	fs 		= require('fs');


var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'matcha'
});

// connection.connect();

// connection.query('SELECT * from users', function(err, rows, fields) {
//   if (!err)
//     console.log('The solution is: ', rows);
//   else
//     console.log('Error while performing Query.');
// 	console.log(err)
// });

// connection.end();



require('./routes')(app);

app.set('view engine', 'ejs');
app.set('views', __dirname+"/views");
app.use("/public", express.static(__dirname + "/public"));


// app.get('/', function(req, res) {
// 	// res.setHeader('Content-Type', 'text/html');
// 	res.render('pages/index');
// });

server.listen(3000);