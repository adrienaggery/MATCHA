module.exports = function(app) {


	let session		= require('express-session')
	let User 		= require('../models/user')
	let Functions	= require('../models/functions')



	app.set('trust proxy', 1) // trust first proxy
	app.use(session({
		secret: 'matcha',
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false }
	}))

	app.use(require('../middlewares/flash'))



	// ******* ACCUEIL *******

	app.get('/', (req, res) => { 
		res.render('pages/index');
	})

	app.get('/signup', (req, res) => { 
		res.redirect('/#signup')
	})

	app.get('/signin', (req, res) => { 
		res.redirect('/#signin')
	})

	// ajouter login + token
	app.post('/signup', (req, res) => {
			// console.log(req.body)
		if (req.body.gender === undefined || req.body.gender === '') {
			req.flash('error', "Veuillez indiquer votre genre.")
			res.redirect('/#signup')
		}
		else if (req.body.name === undefined || req.body.name === '') {
			req.flash('error', "Veuillez indiquer votre nom.")
			res.redirect('/#signup')
		}
		else if (req.body.firstName === undefined || req.body.firstName === '') {
			req.flash('error', "Veuillez indiquer votre prénom.")
			res.redirect('/#signup')
		}
		else if (req.body.email === undefined || req.body.email === '') {
			req.flash('error', "Veuillez indiquer votre email.")
			res.redirect('/#signup')
		}
		else if (req.body.orientation === undefined || req.body.orientation === '') {
			req.flash('error', "Veuillez indiquer votre orientation.")
			res.redirect('/#signup')
		}
		else if (req.body.password === undefined || req.body.password === '') {
			req.flash('error', "Veuillez indiquer votre mot de passe.")
			res.redirect('/#signup')
		}
		else if (Functions.validePassword(req.body.password) === false) {
			req.flash('error', "mot de passe entre 6 et 16 caracteres, contenir caractere special (!@#$&*) et deux lettres majuscules.")
			res.redirect('/#signup')
		}
		else { 
			User.exists(req.body.email, (result) => {
				if (result === true) {
					req.flash('error', "Cette adresse email est déjà utilisée.")
					res.redirect('/#signup')
				}
				else {
					Functions.generateToken((token) => {
						User.create(req.body, token, () => {
							let confirm = "Merci, votre compte a été créé ! Un email de confirmation vous a été envoyé à l'adresse : " + req.body.email + "."
							req.flash('success', confirm)
							res.redirect('/')

						})
						// console.log(token)

						User.sendConfirmationEmail(req.body.email, token, () => {

						})
					})
				}
			})
		}
		
	})

	// activer le compte
	app.get('/confirm/signup/:token', (req, res) => {
		req.params.token


	})



	// ******* PROFILE *******


	app.route('/profile')
		.get((req, res) => {
			res.render('pages/profile')
		})



	// ******* MATCHA *******


	app.route('/matcha')
		.get((req, res) => {
			// var i = 'xyz';
			res.render('pages/test');
		});

}