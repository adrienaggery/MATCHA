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
			req.flash('error', "mot de passe entre 6 et 16 caracteres, contenir caractere special (!@#$&*) et une lettre majuscule.")
			res.redirect('/#signup')
		}
		else { 
			User.emailExists(req.body.email, (result) => {
				if (result !== false) {
					req.flash('error', result)
					res.redirect('/#signup')
				}
				else {
					User.loginExists(req.body.login, (result) => {
						if (result !== false) {
							req.flash('error', result)
							res.redirect('/#signup')
						}
						else {
							Functions.generateToken((token) => {
								User.create(req.body, token, () => {
									let confirm = "Merci, votre compte a été créé ! Un email de confirmation vous a été envoyé à l'adresse : " + req.body.email + "."
									req.flash('success', confirm)
									res.redirect('/')

								})
								User.sendConfirmationEmail(req.body.email, req.body.login, token)
							})
						}
					})
				}
			})
		}
		
	})


	// activer le compte
	app.get('/confirm/signup/:login', (req, res) => {
		User.activate(req.params.login, req.query.token, (error) => {
			if (error) {
				req.flash('error', error)
				res.redirect('/')
			} else {
				req.flash('success', "Votre compte est maintenant activé.")
				res.redirect('/#signin')
			}
		})
	})


	app.post('/signin', (req, res) => { 
		if (req.body.login === undefined || req.body.login === '') {
			req.flash('error', "Veuillez indiquer votre login.")
			res.redirect('/#signin')
		}
		else if (req.body.password === undefined || req.body.password === '') {
			req.flash('error', "Veuillez indiquer votre mot de passe.")
			res.redirect('/#signin')
		}
		else {
			User.connect(req.body, (error) => {
				if (error) {
					req.flash('error', error)
					res.redirect('/#signin')
				} else {
					req.flash('success', "vous etes maintenant connecte")
					res.redirect('/')
				}
			})
		}
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