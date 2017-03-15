module.exports = function(app, User, Functions) {

	let fs 		= require('fs')
	let multer 	= require('multer')
	let storage =   multer.diskStorage({
		destination: function (req, file, callback) {
			callback(null, "public/assets/uploads");
		},
		filename: function (req, file, callback) {
			callback(null, req.session.sessUser.login + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
		}
	});
	var upload = multer({ storage : storage}).array('userPhoto');


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
			var ownProfile = 0
			if (req.session.sessUser.login === req.params.user ) {
				var ownProfile = 1
			}
			User.find(req.params.user, (err, data, profilePic) => {
				if (err) {
					req.flash('error', err)
					res.redirect('/profile/' + req.session.sessUser.login)
				}
				else {
					res.render('pages/profile', {user: data, ownProfile: ownProfile, profilePic: profilePic})
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
		User.emailExists(data.email, req.session.sessUser.email, (err) => {
			if (err) {
				res.send(err)
			} else {
				User.update(data, req.session.sessUser.login, (err) => {
					if (err) {
						req.flash('error', err)
					}
					res.end()
				})
			}
		})
	})


	app.post('/api/photo', (req,res) => {
		User.countPhotos(req.session.sessUser.id, (err, data) => {
			if (err) {
				res.send(err)
			}
			else {
				upload(req, res, function(err) {
					var len =req.files.length
					for (let i = 0; i < len; i++ ) {
						let imgPath = req.files[i].path.replace('public', '')
						if (i + data >= 5) {
							fs.unlink(req.files[i].path, () => {})
						}
						else {
							let isProfile = 0;
							if (data == 0 && i == 0) {
								isProfile = 1
							}
							User.uploadPhoto(imgPath, req.session.sessUser.id, isProfile, (err) => {
								res.send(err)
							})
						}
					}
				})
			}
		})

	})


	app.post('/loadPhotos', (req, res) => {
		User.getId(req.body.user, (err, id) => {
			User.loadPhotos(id, (data) => {
				res.send(data)
			})
		})

	})


	app.post('/deletePhoto', (req, res) => {
		User.deletePhoto(req.body.imgId, (err) => {
			if (!err) {
				fs.unlink("public"+req.body.imgSrc, () => {
					res.end()
				})
			}
		})
	})


}