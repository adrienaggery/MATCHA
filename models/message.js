let connection = require('../config/db')


class Message {


	static create (content, callback) {

		connection.query('INSERT INTO users SET gender = ?, name = ?, firstName = ?, orientation = ?, email = ?, password = ?, createdAt = ?',
			[content.gender, content.name, content.firstName, content.orientation, content.email, content.password, new Date()], (err, result) => {
				if (err) throw err
				callback(result)
			})

	}

}


module.exports = Message 