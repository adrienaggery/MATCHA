module.exports = function (app, User, Functions, Chat, io) {

	var ent 	= 	require('ent')
	var encode 	= 	require('ent/encode');
	var decode 	= 	require('ent/decode');


	// ******* DISCUTION VIA SOCKET.IO *******


	var users = {}

	function parseMessage(text) {

		return text.trim()

	}

	io.sockets.on('connection', function(socket) {
		
		// console.log(socket)

		socket.on('chat message', function(data) {

			message = parseMessage(data.msg)

			if (data.msg != '') {
				Chat.storeMessage(data.sender, data.receiver, message)
				// socket.emit('new_msg', {'sender': data.sender, 'msg': data.msg })
				io.to(users[data.receiver]).emit('new_msg', {'sender': data.sender, 'msg': data.msg })
			}
		})

		socket.on('login', function(data) {
			if (data.login) {
				users[data.login] = socket.id
			}
			if (data.canChat === 1) {
				Chat.loadMessages(data.login, data.currentProfile, function(err, messages) {
					socket.emit('load_chat', {err: err, messages: messages})
				})
			}
			socket.emit('isOnline', {users: users})

		})



		socket.on('disconnect', function(){
			for (key in users) {
				if (users.hasOwnProperty(key) && users[key] == socket.id) {
					User.getId(key, (err, id) => {
						if (!err) {
							User.setDisconnection(id)
						}
					})
					delete users[key];
				}
			}
		})

	})




	// ******* NOTIFICATIONS VIA SOCKET.IO *******




}