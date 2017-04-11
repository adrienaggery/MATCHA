(function($) {

	var currentUser = $('#currentUser').val()
	var currentProfile = $('#currentProfile').val()

	var socket = io.connect('http://localhost:3000')


	socket.on('connect', function(data) {
		console.log('on connect')
		var canChat = (document.getElementById('chat-window') ? 1 : 0)

		socket.emit('login', {login: currentUser,canChat: canChat, currentProfile: currentProfile})
		
	})

	socket.on('load_chat', function(data) {
		for (message in data.messages) {
			insertMessage(data.messages[message].user1, data.messages[message].message)
		}
	})


	socket.on('isOnline', function(users) {
		// sets status online on profile page
		var connectionField = document.getElementById('connection-info')

		// console.log(users[currentProfile])
		// console.log(users.users[currentProfile])
		if (connectionField && users.users.hasOwnProperty(currentProfile)) {
			connectionField.innerHTML = '<p class="online">En ligne</p>'
		}

	})


	$('#chat').submit(function() {
		var msg = $('#m').val()
		msg = escapeHtml(msg)
		msg = deleteBlank(msg)

		if (msg != '') {
			socket.emit('chat message', {'sender': currentUser, 'receiver': currentProfile, 'msg': msg})
			insertMessage(currentUser, msg)
		}
		$('#m').val('')
		return false
	})

	socket.on('new_msg', function(data) {
		$('#chat-window').show()
		insertMessage(data.sender, data.msg)
		
	})



	function insertMessage(login, message) {

		if (document.getElementById('chat-window')) {
			if (login === currentUser) {
				$('#messages').append('<p class="me">' + message + '</p>')
			} else {
				$('#messages').append('<p class="you">' + message + '</p>')
			}
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		}
	}


	function deleteBlank(text) {
		return text.trim()
	}


	function escapeHtml(text) {
		return text
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	}

	
})(jQuery)