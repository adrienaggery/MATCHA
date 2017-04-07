let connection		= require('../config/db')
let sender 			= 'mceccatomatcha@gmail.com'
let Functions 		= require('./functions')
const nodemailer 	= require('nodemailer')
let transporter 	= nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'mceccatomatcha@gmail.com',
		pass: 'matcha42'
	}
})


class User {


	// check if user already exists before creating an account
	static emailExists (email, userEmail, callback) {

		connection.query('SELECT email FROM users WHERE email = ?',
			[email], (err, result) => {
				if (err) {
					return callback(err.stack)
				}
				if (result[0] && result[0].email != userEmail) {
					return callback("Cette adresse email est déjà utilisée.")
				}
				return  callback()
			})

	}

	// check if user already exists before creating an account
	static loginExists (login, callback) {

		connection.query('SELECT login FROM users WHERE login = ?',
			[login], (err, result) => {
				if (err) {
					return callback(err.stack)
				}
				if (result[0]) {
					return callback("Ce login est déjà utilisé.")
				}
				return callback()
			})

	}

	// creating a new user in db
	static create (content, token, callback) {

		Functions.hash(content.password, (password) => {
			connection.query('INSERT INTO users SET gender = ?, name = ?, firstName = ?, orientation = ?, email = ?, login = ?, password = ?, token = ?, city = ?, postal = ?, createdAt = ?',
				[content.gender, content.name, content.firstName, content.orientation, content.email, content.login, password, token, content.city, content.postal, new Date()], (err, result) => {
					if (err) {
						callback(err.stack)
					}
					callback()
				})
		})

	}

	// send an email
	static sendEmail(to, content, subject) {

		let mailOptions = {
			from: sender,
			to: to,
			subject: subject,
			html: content
		}
		transporter.sendMail(mailOptions, (error, info) => {
		})

	}


	static activate(login, token, callback) {

		connection.query('SELECT token, active FROM users where login = ?', [login], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Impossible d'activer votre compte")
			}
			if (result[0].active === 1) {
				return callback("Votre compte est déjà activé.")
			}
			if (result[0].token === token) {
				connection.query('UPDATE users SET active = 1', [], (err) => {
					if (err) {
						return callback(err)
					}
					return callback()
				})
			}
			else {
				return callback("Une erreur est survenue.")
			}
		})

	}


	// generate confirmation email and send it
	static sendConfirmationEmail(email, login, token) {

		var content = "<p>Coucou <strong>" + login + "</strong>, confirmez votre compte sur <a href='http://localhost:3000/confirm/signup/" + login + "?token=" + token + "' >Matcha</a> !</p>"
		var subject = "confirmation d'inscription"

		this.sendEmail(email, content, subject)

	}

	// connect a user
	static connect (content, callback) {

		Functions.hash(content.password, (password) => {

			connection.query('SELECT id, email, password, active FROM users WHERE login = ?', [content.login], (err, result) => {
				if (err) {
					return callback(err.stack)
				}
				if (!result[0]) {
					return callback("Login ou mot de passe incorrect.")
				}
				if (result[0].active === 0) {
					return callback("Merci d'activer votre compte.")
				}
				if (result[0].password !== password) {
					return callback("Login ou mot de passe incorrect.")
				}
				Functions.updateLastConnected(content.login, content.city, content.postal, (err) => {
					if (err) {
						return callback(err)
					}
				})
				return callback(undefined, result[0].id, result[0].email)
			})

		})
	}

	// find a specific user
	static find (login, callback) {

		connection.query('SELECT * FROM users WHERE users.login = ?', [login], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Utilisateur introuvable.")
			}
			this.getProfilePic(login, (err, profilePic) => {
				callback(undefined, result[0], profilePic)
			})
		})

	}


	static getProfilePic(login, callback) {
		connection.query('SELECT path FROM photos INNER JOIN users ON users.id = photos.user_id WHERE users.login = ? AND photos.isProfile = 1', [login], (err, result) => {
			if (err) {
				return callback()
			}
			if (!result[0]) {
				return callback()
			}
			callback(undefined, result[0].path)
		})
	}


	// Update user infos
	static update(data, login, callback) {
		connection.query('UPDATE users SET name = ?, firstName = ?, age = ?, email = ?, gender = ?, orientation = ?, bio = ?, city = ?, postal = ? WHERE login = ?', [data.name, data.firstName, data.age, data.email, data.gender, data.orientation, data.bio, data.city, data.postal, login], (err) => {
			if (err) {
				throw(err.stack)
			}
			return callback()
		})
	}


	static countPhotos(userId, callback) {

		connection.query('SELECT COUNT(id) AS nbr FROM photos WHERE user_id = ?', [userId], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback('Pas de photos')
			}
			if (result[0].nbr >= '5') {
				return callback("Nombre maximum de photos atteint.")
			}
			callback(undefined, result[0].nbr)
		})

	}

	static canLike(userId, callback) {

		connection.query('SELECT COUNT(id) AS nbr FROM photos WHERE user_id = ?', [userId], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback('Pas de photos')
			}
			callback(undefined, result[0].nbr)
		})

	}


	static uploadPhoto(imgPath, userId, isProfile, callback) {

		connection.query('INSERT INTO photos SET user_id = ?, path = ?, isProfile = ?', [userId, imgPath, isProfile], (err) => {
			if (err) {
				return callback(err.stack)
			}
			callback()
		})

	}


	static getId(login, callback) {

		connection.query('SELECT id FROM users WHERE login = ?', [login], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Utilisateur non trouvé")
			}
			callback(undefined, result[0].id)
		})

	}


	static ownPhoto(imgId, userId, callback) {

		connection.query('SELECT user_id FROM photos WHERE id = ?', [imgId], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Photo non trouvée")
			}
			if (result[0].user_id !== userId) {
				return callback("La photo n'appartient pas à l'utilisateur.")
			}
			callback()
		})

	}


	static loadPhotos(userId, callback) {

		connection.query('SELECT path, id FROM photos WHERE user_id = ?', [userId], (err, result) => {
			return callback(result)
		})

	}


	static deletePhoto(id, callback) {

		connection.query('DELETE FROM photos WHERE id = ?', [id], (err) => {
			if (err) {
				return callback(err)
			}
			callback()
		})

	}


	static updateProfilePhoto(imgId, userId, callback) {

		connection.query('UPDATE photos SET isProfile = 0 WHERE user_id = ?', [userId], (err) => {
			if (err) {
				return callback(err)
			}
			connection.query('UPDATE photos SET isProfile = 1 WHERE id = ?', [imgId], (err) => {
				if (err) {
					return callback("Impossible de mettre à jour la photo de profile.")
				}
				callback()
			})
		})

	}


	static loadUserInterests(userId, callback) {

		connection.query('SELECT t.name FROM tags t INNER JOIN users_tags ut ON t.id = ut.tag_id WHERE ut.user_id = ?', [userId], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Aucun tag")
			}
			callback(undefined, result)
		})

	}


	static updateUserInterests(userId, tagList, callback) {

		connection.query('DELETE FROM users_tags WHERE user_id = ?', [userId], (err) => {
			if (err) {
				return callback("Impossible de mettre à jour la liste d'intérêts")
			}
			for (let i = 0, len = tagList.length ; i < len; i++) {
				connection.query('INSERT INTO users_tags SET user_id = ?, tag_id = ?', [userId, tagList[i]], (err) => {
					if (err) {
						return callback("Impossible de mettre à jour la liste d'intérêts")
					}
					return callback()
				})
			}
		})

	}


	static loadViewers(userId, callback) {

		connection.query("SELECT pv.id_viewer, DATE_FORMAT(pv.viewed_at, 'Le %d\/%e\/%Y à %H\H%i') AS viewed_at, u.login, u.age, p.path FROM profile_views pv INNER JOIN users u ON pv.id_viewer = u.id LEFT JOIN photos p ON pv.id_viewer = p.user_id AND p.isProfile = 1 WHERE pv.id_user = ? ORDER BY viewed_at DESC", [userId], (err, result) => {
			if (err) {
				return callback("Impossible de charger la liste des personnes qui ont regardé votre profile.")
			}
			if (!result[0]) {
				return callback("Aucune personne n'a vu votre profile.")
			}
			else {
				return callback(undefined, result)
			}
		})

	}


	static loadLikers(userId, callback) {

		connection.query("SELECT l.id_liker, DATE_FORMAT(l.liked_at, 'Le %d\/%e\/%Y à %H\H%i') AS viewed_at, u.login, u.age, p.path FROM likes l INNER JOIN users u ON l.id_liker = u.id LEFT JOIN photos p ON l.id_liker = p.user_id AND p.isProfile = 1 WHERE l.id_user = ? ORDER BY viewed_at DESC", [userId], (err, result) => {
			if (err) {
				return callback("Impossible de charger la liste des personnes qui ont liké votre profile.")
			}
			if (!result[0]) {
				return callback("Aucune personne n'a liké votre profile pour le moment.")
			}
			else {
				return callback(undefined, result)
			}
		})

	}


	static getPopularity(userId, callback) {

		connection.query('SELECT count(pv.id_user) AS views, count(l.id_user) AS likes FROM profile_views pv INNER JOIN likes l ON l.id_user = pv.id_user WHERE pv.id_user = ?', [userId], (err, result) => {
			if (err) {
				return callback("Impossible de charger la liste des personnes qui ont liké votre profile.")
			}
			if (!result[0]) {
				return callback("Impossible de charger le score de popularité.")
			}
			if (result[0].views == 0 || result[0].likes == 0) {
				return callback(undefined, 0)
			}
			var popularity = (result[0].views / result[0].likes) * 100
			return callback(undefined, popularity)
		})

	}


}


module.exports = User



