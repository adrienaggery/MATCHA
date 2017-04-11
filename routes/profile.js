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

		var canLike = 0
		var mutualLike = 0

		User.find(req.params.user, (err, data, profilePic) => {
			if (err) {
				req.flash('error', err)
				return res.redirect('/profile/' + req.session.sessUser.login)
			}
			if (ownProfile == 0) {
				User.getId(req.params.user, (err, id) => {
					if (!err) {
						Functions.addViewer(id, req.session.sessUser.id)
						User.canLike(req.session.sessUser.id, (err, nbrPhotos) => {
							if (!err && nbrPhotos > 0) {
								canLike = 1
							}
						})
					}
				})
			}
			User.getId(req.params.user, (err, id) => {
				if (!err) {
					var isLike = 0
					Functions.isLike(id, req.session.sessUser.id, (err, mutualLike) => {
						if (!err) {
							isLike = 1
						}
						Functions.isMutualLike(id, req.session.sessUser.id, (err, mutualLike) => {
							if (!err) {
								mutualLike = 1
							}
							Functions.loadInterestsList((err, interestList) => {
								User.loadViewers(req.session.sessUser.id, (err, viewers) => {
									if (!err) {
										var listViewers = viewers
									}
									User.loadLikers(req.session.sessUser.id, (err, likers) => {
										if (!err) {
											var likers = likers
										}
										User.getPopularity(id, (err, pop) => {
											var popularity = 0
											if (!err) {
												popularity = pop
											}
											return res.render('pages/profile', {user: data, currentUser:req.session.sessUser.login, ownProfile: ownProfile, profilePic: profilePic, interestList: interestList, listViewers: listViewers, canLike: canLike, likers: likers, isLike: isLike, mutualLike: mutualLike, popularity: popularity})
										})
									})
								})
							})
						})
					})
				}
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
		if (!req.session.sessUser) {
			return res.end()
		}
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
		if (!req.session.sessUser) {
			return res.end()
		}
		User.getId(req.body.user, (err, id) => {
			User.loadPhotos(id, (data) => {
				return res.send(data)
			})
		})

	})


	app.post('/deletePhoto', (req, res) => {
		if (!req.session.sessUser) {
			return res.end()
		}
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
		if (!req.session.sessUser) {
			return res.end()
		}
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
		if (!req.session.sessUser) {
			return res.end()
		}
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
		if (!req.session.sessUser) {
			return res.end()
		}
		User.updateUserInterests(req.session.sessUser.id, req.body['tagList[]'], (err, interests) => {
			if (err) {
				return res.send(err)
			}
			return res.end()
		})

	})


	app.post('/addLiker', (req, res) => {
		if (!req.session.sessUser) {
			return res.send("Vous devez etre connecté pour effectuer cette action.")
		}
		User.getId(req.body.user, (err, id) => {
			if (err) {
				return res.send("Utilisateur introuvable.")
			}
			Functions.addLiker(id, req.session.sessUser.id)
			return res.end()
		})
	})


	app.post('/removeLiker', (req, res) => {
		if (!req.session.sessUser) {
			return res.send("Vous devez etre connecté pour effectuer cette action.")
		}
		User.getId(req.body.user, (err, id) => {
			if (err) {
				return res.send("Utilisateur introuvable.")
			}
			Functions.removeLiker(id, req.session.sessUser.id)
			return res.end()
		})
	})


	app.post('/reportUser', (req, res) => {
		if (!req.session.sessUser) {
			return res.send("Vous devez etre connecté pour effectuer cette action.")
		}
		let content = "<h2>Signalement d'utilisateur</h2>"
		content += "" + req.session.sessUser.login + " a signalé l'utilisateur '"+ req.body.user +"' comme étant un faux compte."
		User.sendEmail('mathieu.ceccato@gmail.com', content,"Signalement d'utilisateur")
		return res.send("Utilisateur signalé avec succès.")
	})




}