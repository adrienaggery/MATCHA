module.exports = function (request, response, next) {


	if (request.session.sessUser) {
		response.locals.sessUser = request.session.sessUser
		// request.session.flash = undefined
	}

	request.sessUser = function (type, content) {
		if (request.session.sessUser === undefined) {
			request.session.sessUser = {}
		}
		request.session.sessUser[type] = content
	}

	next()
}