let express 	= require('express')
let	app			= express()


	// server 		= require('http').createServer(app),
	// io			= require('socket.io').listen(server),
	// ent			= require('ent'),		// htmlentities
	// mysql 		= require('mysql'),
	// bodyParser 	= require('body-parser'),
	// fs 			= require('fs');

// require('./routes')(app, bodyParser)


app.set('view engine', 'ejs')

app.use(express.static('public'))

app.set('views', __dirname+"/views")






app.get('/', (request, response) => {
	response.render('pages/index', {test: "coucoucoucou"})
})



// app.get('/', function(req, res) {
// 	// res.setHeader('Content-Type', 'text/html');
// 	res.render('pages/index');
// });

app.listen(8080)