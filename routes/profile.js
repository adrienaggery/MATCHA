module.exports = function(app, User, Functions) {


	// ******* PROFILE *******


	app.get('/profile', (req, res) => {

		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			res.redirect('/#signin')
		}
		else {
			res.redirect('/profile/' + req.session.sessUser.login)
		}
	})


	app.get('/profile/:user', (req, res) => {

		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			res.redirect('/#signin')
		}
		else {
			User.find(req.params.user, (err, data) => {
				if (err) {
					req.flash('error', err)
					res.redirect('/profile/' + req.session.sessUser.login)
				}
				else {
					// console.log(data.name)
					res.render('pages/profile', {user: data})
				}

			})

		}


	})


}