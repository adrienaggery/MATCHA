module.exports = function(app, bodyParser) {
	
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	app.route('/')
		.get(function(req, res) {
			res.render('pages/index');
		})
		.post(function(req, res) {
			// res.render('pages/test');
			console.log(req.body)
			// res.statusCode = 302;
			// res.setHeader('Location', 'test');
			// res.end();
			res.redirect('/test')
		})
			


	app.route('/test')
		.get(function(req, res) {
			// var i = 'xyz';
			res.render('pages/test');
		});

	app.route('/profile')
		.get(function(req, res) {
			res.render('pages/profile')
		})

}