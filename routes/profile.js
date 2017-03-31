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


	app.get('/profile/:user', (req, res) => {

		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			return res.redirect('/#signin')
		}
		var ownProfile = 0
		if (req.session.sessUser.login === req.params.user ) {
			var ownProfile = 1
		}

		if (ownProfile == 0) {
			User.getId(req.params.user, (err, id) => {
				if (!err) {
					Functions.addViewer(id, req.session.sessUser.id)
				}
			})
			var listViewers = null
		}

		User.find(req.params.user, (err, data, profilePic) => {
			if (err) {
				req.flash('error', err)
				return res.redirect('/profile/' + req.session.sessUser.login)
			}
			Functions.loadInterestsList((err, interestList) => {
				User.loadViewers(req.session.sessUser.id, (err, viewers) => {
					if (err) {
						var listViewers = err
					} else {
						var listViewers = viewers
					}
					return res.render('pages/profile', {user: data, ownProfile: ownProfile, profilePic: profilePic, interestList: interestList, listViewers: listViewers})
				})
			})

		})

	})

	app.post('/updateUser', (req, res) => {
		if (req.session.sessUser == undefined) {
			req.flash('error', "Merci de vous connecter pour accéder à cette partie du site.")
			res.redirect('/#signin')
		}
		var data = JSON.parse(req.body.data)
		User.emailExists(data.email, req.session.sessUser.email, (err) => {
			if (err) {
				return res.send(err)
			}
			User.update(data, req.session.sessUser.login, (err) => {
				if (err) {
					return req.flash('error', err)
				}
				return res.end()
			})
		})
	})


	app.post('/api/photo', (req,res) => {
		User.countPhotos(req.session.sessUser.id, (err, data) => {
			if (err) {
				return res.send(err)
			}
			upload(req, res, function(err) {
				var len = req.files.length
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
							return res.send(err)
						})
					}
				}
			})
		})

	})


	app.post('/loadPhotos', (req, res) => {
		User.getId(req.body.user, (err, id) => {
			User.loadPhotos(id, (data) => {
				return res.send(data)
			})
		})

	})


	app.post('/deletePhoto', (req, res) => {
		User.ownPhoto(req.body.imgId, req.session.sessUser.id, (err) => {
			if (err) {
				return res.end()
			}
			User.deletePhoto(req.body.imgId, (err) => {
				if (err) {
					return res.send('Impossible de supprimer la photo.')
				}
				fs.unlink("public"+req.body.imgSrc, () => {
					return res.end()
				})

			})
		})
	})


	app.post('/updateProfilePhoto', (req, res) => {
		User.ownPhoto(req.body.imgId, req.session.sessUser.id, (err) => {
			if (err) {
				return res.end()
			}
			User.updateProfilePhoto(req.body.imgId, req.session.sessUser.id, (err) => {
				if (err) {
					return res.send('Impossible de mettre à jour la photo.')
				} 
				return res.end()

			})
		})
	})

	app.post('/loadUserInterests', (req, res) => {

		User.getId(req.body.user, (err, id) => {
			if (err) {
				return res.end()
			}
			User.loadUserInterests(id, (err, interests) => {
				if (err) {
					interests = null
				}
				return res.send(interests)
			})
		})

	})


	app.post('/updateUserInterests', (req, res) => {
		User.updateUserInterests(req.session.sessUser.id, req.body['tagList[]'], (err, interests) => {
			if (err) {
				return res.send(err)
			}
			return res.end()
		})

	})




}