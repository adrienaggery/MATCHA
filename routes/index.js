module.exports = function(app) {


	let User 		= require('../models/user')
	let Functions	= require('../models/functions')




	// ******* MIDDLEWARES *******

	app.use(require('../middlewares/flash'))
	app.use(require('../middlewares/sessUser'))


	

	// ******* ROUTES *******

	require('./main')(app, User, Functions);			// page d'accueil
	require('./profile')(app, User, Functions);
	require('./matcha')(app, User, Functions);
	app.use((req, res) => {
		res.redirect('/')
	})


}