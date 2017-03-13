module.exports = function(app, User, Functions) {


	// ******* ACCUEIL *******


	app.get('/', (req, res) => { 
		if (req.session.sessUser == undefined) {
		res.render('pages/index')
		} else {
			res.redirect('/profile/' + req.session.sessUser.login)
		}
	})


	app.post('/signup', (req, res) => {
		if (req.body.name === undefined || req.body.name === '') {
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
		else if (req.body.login === undefined || req.body.login === '') {
			req.flash('error', "Veuillez indiquer votre login.")
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
			User.emailExists(req.body.email, (err) => {
				if (err) {
					req.flash('error', err)
					res.redirect('/#signup')
				}
				else {
					User.loginExists(req.body.login, (err) => {
						if (err) {
							req.flash('error', err)
							res.redirect('/#signup')
						}
						else {
							Functions.generateToken((token) => {
								User.create(req.body, token, (err) => {
									if (err) {
										req.flash('error', err)
									}
									else {
										let confirm = "Merci, votre compte a été créé ! Un email de confirmation vous a été envoyé à l'adresse : " + req.body.email + "."
										req.flash('success', confirm)
										res.redirect('/')
									}

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
		User.activate(req.params.login, req.query.token, (err) => {
			if (err) {
				req.flash('error', err)
				res.redirect('/')
			} else {
				req.flash('success', "Votre compte est maintenant activé.")
				res.redirect('/')
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
			User.connect(req.body, (err) => {
				if (err) {
					req.flash('error', err)
					res.redirect('/#signin')
				} else {
					req.sessUser('login', req.body.login)
					req.flash('info', "vous etes maintenant connecté")
					res.redirect('/profile/' + req.session.sessUser.login)
				}
			})
		}
	})


	app.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			if (err) throw err
			res.redirect('/')
		})
	})


}