var express 	= require('express')
var	app			= express()
var bodyParser 	= require('body-parser')
var session		= require('express-session')
// var http 		= require('http').Server(app)
server = app.listen(3000)
var io			= require('socket.io')(server)


// Moteur de template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'matcha',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))


// Routes
app.set('views', __dirname+"/views")
require('./routes')(app, io)




