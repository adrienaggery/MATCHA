module.exports = function(app, User, Functions) {


	app.get('/profile', (req, res) => {
		// console.log(req.session)
		res.render('pages/profile')
	})

}