let hasha 	= require('hasha')
let crypto 	= require('crypto')

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


	static hash(password, callback) {

		var newPassword = hasha(password)
		callback(newPassword)
	}


}

module.exports = Functions