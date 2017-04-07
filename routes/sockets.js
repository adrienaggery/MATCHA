module.exports = function (app, User, Functions, io) {


	// ******* DISCUTION VIA SOCKET.IO *******


	var users = {}

	io.sockets.on('connection', function(socket) {
		
		// console.log(socket)

		socket.on('chat message', function(data) {
			// console.log('message de ' + data.currentProfile + ': ' + data.msg)
			if (data.msg != '') {
				// socket.emit('new_msg', {'sender': data.sender, 'msg': data.msg })
				io.to(users[data.receiver]).emit('new_msg', {'sender': data.sender, 'msg': data.msg })
			}
		})

		socket.on('login', function(data) {
			if (data.login) {
				users[data.login] = socket.id
			}
		})


		socket.on('disconnect', function(){
			for (key in users) {
				if (users.hasOwnProperty(key) && users[key] == socket.id) {
					delete users[key];
				}
			}
		})

	})




	// ******* NOTIFICATIONS VIA SOCKET.IO *******




}