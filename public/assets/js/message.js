(function($) {

	var currentUser = $('#currentUser').val()
	var currentProfile = $('#currentProfile').val()

	var socket = io.connect('http://localhost:3000')


	socket.on('connect', function(data) {
		console.log('on connect')
		socket.emit('login', {login: currentUser})
	})


	$('#chat').submit(function() {
		var msg = $('#m').val()
		if (msg != '') {
			socket.emit('chat message', {'sender': currentUser, 'receiver': currentProfile, 'msg': msg})
			insertMessage(currentUser, msg)
		}
		$('#m').val('')
		return false
	})

	socket.on('new_msg', function(data) {
		insertMessage(data.sender, data.msg)
		
	})



	function insertMessage(login, message) {

		if (document.getElementById('chat-window')) {
			$('#chat-window').show()
			if (login === currentUser) {
				$('#messages').append('<p class="me">' + message + '</p>')
			} else {
				$('#messages').append('<p class="you">' + message + '</p>')
			}
			$('#messages').scrollTop($('#messages')[0].scrollHeight);
		}
	}

	
})(jQuery)