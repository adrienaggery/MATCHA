let connection = require('../config/db')


class User {


	static exists (email, callback) {

		connection.query('SELECT email FROM users WHERE email = ?',
			[email], (err, result) => {
				if (err) throw err
				if (result[0]) callback(true)
				else callback(false)
			})

	}


	static create (content, callback) {

		connection.query('INSERT INTO users SET gender = ?, name = ?, firstName = ?, orientation = ?, email = ?, password = ?, createdAt = ?',
			[content.gender, content.name, content.firstName, content.orientation, content.email, content.password, new Date()], (err, result) => {
				if (err) throw err
				callback(result)
			})

	}

	static connect (login, password, callback) {
		// to do
	}

}


module.exports = User 