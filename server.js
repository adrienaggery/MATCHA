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
// app.set('trust proxy', 1) // trust first proxy
app.use(session({
	secret: 'matcha',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false }
}))
app.use(require('./middlewares/flash.js'))

// Routes
app.set('views', __dirname+"/views")
// require('./routes')(app)





	app.get('/', function(req, res) {
		console.log(req.session)
		res.render('pages/index');
	})

	app.post('/', function(req, res) {
					
		if (req.body.gender === undefined || req.body.gender === '') {
			req.flash = ('error', "Veuillez indiquer votre genre.")
			res.redirect('/')
		}
		else if (req.body.name === undefined || req.body.name === '') {
			req.flash = ('error', "Veuillez indiquer votre nom.")
			res.redirect('/')
		}
		else if (req.body.firstName === undefined || req.body.firstName === '') {
			req.flash = ('error', "Veuillez indiquer votre prénom.")
			res.redirect('/')
		}
		else if (req.body.email === undefined || req.body.email === '') {
			req.flash = ('error', "Veuillez indiquer votre email.")
			res.redirect('/')
		}
		else if (req.body.orientation === undefined || req.body.orientation === '') {
			req.flash = ('error', "Veuillez indiquer votre orientation.")
			res.redirect('/')
		}
		else if (req.body.password === undefined || req.body.password === '') {
			req.flash = ('error', "Veuillez indiquer votre mot de passe.")
			res.redirect('/')
		}
		else {
			// REQ SQL
		}
	})
		


app.route('/profile')
	.get((req, res) => {
		res.render('pages/profile')
	})


app.route('/matcha')
	.get((req, res) => {
		// var i = 'xyz';
		res.render('pages/test');
	});







app.listen(8080)