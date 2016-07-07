module.exports = function(app) {
	
	app.route('/')
		.get(function(req, res) {
			res.render('pages/index');
		})
		.post(function(req, res) {
			res.render('pages/test');
		})
			


	app.route('/test')
		.get(function(req, res) {
			// var i = 'xyz';
			res.render('pages/test');
	});

}