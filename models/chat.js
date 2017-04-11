let connection	= require('../config/db')


class Chat
{
	
	static storeMessage(user1, user2, message) {

		connection.query('INSERT INTO messages SET user1 = ?, user2 = ?, message = ?', [user1, user2, message], (err) => {
			if (err) {
				// console.log(err.stack)
			}
		})

	}


	static loadMessages(user1, user2, callback) {

		connection.query('SELECT message, user1 FROM messages WHERE (user1 = ? OR user1 = ?) AND (user2 = ? OR user2 = ?)', [user1, user2, user1, user2], (err, result) => {

			if (err) {
				return callback('Impossible de charger les messages.')
			}
			if (!result[0]) {
				return callback('Pas de messages')
			}
			return callback(undefined, result)

		})

	}

}

module.exports = Chat