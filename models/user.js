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
	static emailExists (email, callback) {

		connection.query('SELECT email FROM users WHERE email = ?',
			[email], (err, result) => {
				if (err) throw err
				if (result[0]) callback("Cette adresse email est déjà utilisée.")
				else callback(false)
			})

	}

	// check if user already exists before creating an account
	static loginExists (login, callback) {

		connection.query('SELECT login FROM users WHERE login = ?',
			[login], (err, result) => {
				if (err) throw err
				if (result[0]) callback("Ce login est déjà utilisé.")
				else callback(false)
			})

	}

	// creating a new user in db
	static create (content, token, callback) {

		Functions.hash(content.password, (password) => {
			connection.query('INSERT INTO users SET gender = ?, name = ?, firstName = ?, orientation = ?, email = ?, login = ?, password = ?, token = ?, position = ?, createdAt = ?',
				[content.gender, content.name, content.firstName, content.orientation, content.email, content.login, password, token, content.position, new Date()], (err, result) => {
					if (err) throw err
					callback()
				})
		})

	}

	// send an email
	static sendEmail(to, content, subject, callback) {

		let mailOptions = {
			from: sender,
			to: to,
			subject: subject,
			html: content
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) throw error
		})

	}


	static activate(login, token, callback) {

		connection.query('SELECT token FROM users where login = ?', [login], (err, result) => {
			if (err) throw err
			if (!result[0]) callback("Impossible d'activer votre compte")
			else {
				if (result[0].token === token) {
					connection.query('UPDATE users SET active = 1', [], (err) => {
						if (err) throw err
						callback()
					})
				} else {
					callback("Une erreur est survenue.")
				}
			}
		})

	}


	// generate confirmation email and send it
	static sendConfirmationEmail(email, login, token) {

		var content = "<p>Coucou, confirmez votre compte sur <a href='http://localhost:3000/confirm/signup/" + login + "?token=" + token + "' >Matcha</a> !</p>"
		var subject = "confirmation d'inscription"

		this.sendEmail(email, content, subject, () => {
			console.log('message sent')
		})

	}

	// connect a user
	static connect (content, callback) {

		Functions.hash(content.password, (password) => {

			connection.query('SELECT password FROM users where login = ?', [content.login], (err, result) => {
				if (err) throw err
				if (!result[0]) callback("Login ou mot de passe incorrect.")
				else {
					if (result[0].password !== password) callback("Login ou mot de passe incorrect.")
					else {
						Functions.updateLastConnected(content.login, content.position)
						callback()
					}
				}
			})

		})
	}

}


module.exports = User 