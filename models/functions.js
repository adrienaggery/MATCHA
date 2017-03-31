let hasha 		= require('hasha')
let crypto 		= require('crypto')
let connection	= require('../config/db')

class Functions {


	static generateToken(callback) {

		crypto.randomBytes(48, function(err, buffer) {
			var token = buffer.toString('hex')
			callback(token)
		})

	}

	static validePassword(password) {

		var minNumberofChars = 6
		var maxNumberofChars = 16
		var regularExpression = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[a-z].*[a-z].*[a-z]).{6,16}$/

		if (password.length < minNumberofChars || password.length > maxNumberofChars){
			return false
		}
		if (!regularExpression.test(password)) {
			return false
		}

	}


	static hash(data, callback) {

		var newData = hasha(data)
		callback(newData)
	}


	static updateLastConnected(login, city, postal, callback) {

		connection.query('UPDATE users SET city = ?, postal = ?, lastConnected = ? WHERE login = ?', [city, postal, new Date(), login], (err) => {
			if (err) {
				callback(err)
			}
		})

	}

	static loadInterestsList(callback) {

		connection.query('SELECT id, name FROM tags', (err, result) => {
			if (err) {
				return callback(err.stack)
			}
			if (!result[0]) {
				return callback('Pas de tags.')
			}
			return callback(undefined, result)
		})
	}


	static addViewer(userId, viewerId) {

		connection.query('DELETE FROM profile_views WHERE id_user = ? AND id_viewer = ?', [userId, viewerId], (err) => {
			if(!err) {
				connection.query('INSERT INTO profile_views SET id_user = ?, id_viewer = ?, viewed_at = ?', [userId, viewerId, new Date()], (err) => {
				})
			}
		})

	}


}

module.exports = Functions