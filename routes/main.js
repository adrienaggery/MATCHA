module.exports = function(app, User, Functions) {


	// ******* ACCUEIL *******


	app.get('/', (req, res) => { 
		if (req.session.sessUser == undefined) {
			return res.render('pages/index')
		}
		return res.redirect('/profile/' + req.session.sessUser.login)
	})


	app.post('/signup', (req, res) => {
		if (req.body.name === undefined || req.body.name === '') {
			req.flash('error', "Veuillez indiquer votre nom.")
			return res.redirect('/#signup')
		}
		if (req.body.firstName === undefined || req.body.firstName === '') {
			req.flash('error', "Veuillez indiquer votre prénom.")
			return res.redirect('/#signup')
		}
		if (req.body.email === undefined || req.body.email === '') {
			req.flash('error', "Veuillez indiquer votre email.")
			return res.redirect('/#signup')
		}
		if (req.body.login === undefined || req.body.login === '') {
			req.flash('error', "Veuillez indiquer votre login.")
			return res.redirect('/#signup')
		}
		if (req.body.password === undefined || req.body.password === '') {
			req.flash('error', "Veuillez indiquer votre mot de passe.")
			return res.redirect('/#signup')
		}
		if (Functions.validePassword(req.body.password) === false) {
			req.flash('error', "mot de passe entre 6 et 16 caracteres, contenir caractere special (!@#$&*) et une lettre majuscule.")
			return res.redirect('/#signup')
		}

		User.emailExists(req.body.email, null, (err) => {
			if (err) {
				req.flash('error', err)
				return res.redirect('/#signup')
			}
			User.loginExists(req.body.login, (err) => {
				if (err) {
					req.flash('error', err)
					return res.redirect('/#signup')
				}
				Functions.generateToken((token) => {
					req.body.login = req.body.login.replace(/\//g, "")
					User.create(req.body, token, (err) => {
						if (err) {
							req.flash('error', err)
							return res.redirect('/')
						}
						User.sendConfirmationEmail(req.body.email, req.body.login, token)
						let confirm = "Merci, votre compte a été créé ! Un email de confirmation vous a été envoyé à l'adresse : " + req.body.email + "."
						req.flash('success', confirm)
						return res.redirect('/')
					})
				})
			})
		})

	})


	// activer le compte
	app.get('/confirm/signup/:login', (req, res) => {
		User.activate(req.params.login, req.query.token, (err) => {
			if (err) {
				req.flash('error', err)
				return res.redirect('/')
			}
			req.flash('success', "Votre compte est maintenant activé.")
			return res.redirect('/')
		})
	})


	app.post('/signin', (req, res) => { 
		if (req.body.login === undefined || req.body.login === '') {
			req.flash('error', "Veuillez indiquer votre login.")
			return res.redirect('/#signin')
		}
		if (req.body.password === undefined || req.body.password === '') {
			req.flash('error', "Veuillez indiquer votre mot de passe.")
			return res.redirect('/#signin')
		}
		User.connect(req.body, (err, id, email) => {
			if (err) {
				req.flash('error', err)
				return res.redirect('/#signin')
			}
				req.sessUser('login', req.body.login)
				req.sessUser('id', id)
				req.sessUser('email', email)
				req.flash('info', "vous etes maintenant connecté")
				return res.redirect('/profile/' + req.session.sessUser.login)
		})
	})


	app.get('/logout', (req, res) => {
		req.session.destroy((err) => {
			if (err) throw err
			return res.redirect('/')
		})
	})


}