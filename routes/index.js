module.exports = function(app, io) {


	let User 		= require('../models/user')
	let Functions	= require('../models/functions')



	// ******* MIDDLEWARES *******

	app.use(require('../middlewares/flash'))
	app.use(require('../middlewares/sessUser'))

	

	// ******* ROUTES *******

	require('./main')(app, User, Functions);			// page d'accueil
	require('./profile')(app, User, Functions);			// page de profile
	require('./sockets')(app, User, Functions, io);	// page de profile
	require('./matcha')(app, User, Functions);			// page de recherche matcha

	// si mauvaise url, redirection page d'accueil
	app.use((req, res) => {
		res.redirect('/')
	})


}