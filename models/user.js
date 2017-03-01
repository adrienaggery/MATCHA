let connection		= require('../config/db')
let sender 			= 'mceccatomatcha@gmail.com'
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
	static exists (email, callback) {

		connection.query('SELECT email FROM users WHERE email = ?',
			[email], (err, result) => {
				if (err) throw err
				if (result[0]) callback(true)
				else callback(false)
			})

	}

	// creating a new user in db
	static create (content, token, callback) {

		connection.query('INSERT INTO users SET gender = ?, name = ?, firstName = ?, orientation = ?, email = ?, password = ?, token = ?, createdAt = ?',
			[content.gender, content.name, content.firstName, content.orientation, content.email, content.password, token, new Date()], (err, result) => {
				if (err) throw err
				callback(result)
			})

	}

	// send an email
	static sendEmail(from, to, content, subject, callback) {

		let mailOptions = {
			from: from,
			to: to,
			subject: subject,
			html: content
		}
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) throw error
		})

	}

	// generate confirmation email and send it
	static sendConfirmationEmail(email, token, callback) {

		var from = sender
		var content = "<p>coucou, confirmez votre compte sur <a href='http://localhost:3000/confirm/signup/" + token + "' >Matcha</a> !</p>"
		var subject = "confirmation d'inscription"

		this.sendEmail(from, email, content, subject, () => {
			console.log('message sent')
		})

	}

	// connect a user
	static connect (login, password, callback) {
		// to do
	}

}


module.exports = User 