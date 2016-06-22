module.exports = function(app) {
	
	app.get('/', function(req, res) {
		res.render('pages/index');
	});
	app.get('/test/:id', function(req, res) {
		var i = 'coucou';
		res.render('pages/test',{id: req.params.id, i: i});
	});

}