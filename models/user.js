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
					console.log(result[0].email)
					console.log(userEmail)
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

		var content = "<p>Coucou, confirmez votre compte sur <a href='http://localhost:3000/confirm/signup/" + login + "?token=" + token + "' >Matcha</a> !</p>"
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

		connection.query('SELECT * FROM users WHERE login = ?', [login], (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback("Utilisateur introuvable.")
			}
			callback(undefined, result[0])
		})

	}


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
				return callback()
			}
			if (result[0].nbr >= '5') {
				return callback("Nombre maximum de photos atteint.")
			}
			callback()
		})

	}


	static uploadPhoto(imgPath, userId, callback) {

		connection.query('INSERT INTO photos SET user_id = ?, path = ?', [userId, imgPath], (err) => {
			if (err) {
				return callback(err.stack)
			}
			callback()
		})

	}


	static loadPhotos(userId, callback) {

		connection.query('SELECT path FROM photos WHERE user_id = ?', [userId], (err, result) => {
			return callback(result)
		})

	}

}


module.exports = User 