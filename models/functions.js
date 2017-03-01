class Functions {


	static generateToken(callback) {

		require ('crypto').randomBytes(48, function(err, buffer) {
			var token = buffer.toString('hex')
			// console.log(token)
			callback(token)
		})

	}

	static validePassword(password) {

		var minNumberofChars = 6
		var maxNumberofChars = 16
		var regularExpression = /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[a-z].*[a-z].*[a-z]).{6,16}$/

		if (password.length < minNumberofChars || password.length > maxNumberofChars){
			return false
		}
		if (!regularExpression.test(password)) {
			return false
		}

	}


}

module.exports = Functions