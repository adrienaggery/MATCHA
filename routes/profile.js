module.exports = function(app, User, Functions) {


	// ******* PROFILE *******


	app.get('/profile', (req, res) => {

		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			res.redirect('/#signin')
		}
		else {
			res.render('pages/profile')
		}
	})

}