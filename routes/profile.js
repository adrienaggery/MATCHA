module.exports = function(app, User, Functions) {


	let multer = require('multer')
	let storage =   multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, "public/assets/uploads");
		},
		filename: function (req, file, callback) {
			callback(null, req.session.sessUser.login + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
		}
	});
	var upload = multer({ storage : storage}).single('userPhoto');


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
					res.render('pages/profile', {user: data})
				}

			})

		}

	})

	app.post('/updateUser', (req, res) => {
		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			res.redirect('/#signin')
		}
		var data = JSON.parse(req.body.data)
		User.update(data, req.session.sessUser.login, (err) => {
			if (err) {
				req.flash('error', err)
			}
			res.end()
		})
	})


	app.post('/api/photo',function(req,res) {
		upload(req, res, function(err) {
			if (err) {
				return res.end("Error uploading file.");
			}
			let imgPath = req.file.path.replace('public', '')
			// upload en bdd imgPath
			res.redirect('/profile/' + req.session.sessUser.login)
		});
	});


}