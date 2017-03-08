let express 	= require('express')
let	app			= express()
let bodyParser 	= require('body-parser')
let session		= require('express-session')



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
// app.use(require('./middlewares/flash.js'))

// Routes
app.set('views', __dirname+"/views")
require('./routes')(app)





app.listen(3000)