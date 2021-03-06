$(document).ready(function(){

	var user = $('#login').text()

	$('#edit').on("click", function(e) {
		e.preventDefault();
		$('#profileinfo').hide("slow");
		$('#profileinfo-edit').show("slow");
	});

	// Edit des infos
	$('#validate-edit').on("click", function(e) {
		e.preventDefault();

		var data = {}
		var value = ''
		var name = ''
		var newid = ''
		$('input[type="text"], input[type="radio"]:checked, textarea', '#profileinfo-edit').each(function() {
			value = $(this).val();
			name = $(this).attr('name')
			newid = $(this).attr('id').split('-')[1]
			$("#"+newid).text(value)
			data[name] = value;
		});

		data = JSON.stringify(data)
		$.post('/updateUser', {data: data}, function(err) {
			if (err) {
				$('#profile-error').text(err)
			}
			else {
				$('#profile-error').text()			
			}
		});

		$('#profileinfo-edit').hide("slow");
		$('#profileinfo').show("slow");
	});


	// Upload des photos
	$('#userPhoto-send').on('click', function(e) {
		e.preventDefault()
		var userPhoto = new FormData($('#uploadForm')[0])

		$.ajax({
			url: '/api/photo',
			data: userPhoto,
			cache: false,
			contentType: false,
			processData: false,
			type: 'POST',
			success: function(data) {
				if (data) {
					$('#uploadStatus').text(data)
				}
				else {
					$('#uploadStatus').text('Upload réussi !')
					handleLoadPhotos()
				}
			}
		})

	})

	handleLoadPhotos()

	function handleLoadPhotos() {

		var user = $('#login').text()
		var ownProfile = $('#ownProfile').val()
		$.post('/loadPhotos', {user: user}, function(data) {
			$('#loadPhotos').html('')
			for (i in data) {
				if (ownProfile == 1) {
					$('#loadPhotos').append('<div id="' + data[i].id + '" class="img-container"><img src="' + data[i].path + '" /><span class="btn btn-danger delete">X</span><span class="btn btn-default setProfile" title="C\'est ma photo de profile"><i class="glyphicon glyphicon-check"></i></span></div>')
				} else {
					$('#loadPhotos').append('<div id="' + data[i].id + '" class="img-container"><img src="' + data[i].path + '" /></div>')
				}
			}

			$('.img-container span.delete').on('click', function(e) {

				e.preventDefault()
				var imgId = $(this).parent().attr('id')
				var imgSrc = $(this).prev().attr('src')

				$.post('/deletePhoto', {imgId: imgId, imgSrc: imgSrc}, function(data) {
					$('#'+imgId).fadeOut('slow', function() {
						$(this).detach()
					})
				})
			})

			$('.img-container span.setProfile').on('click', function(e) {

				e.preventDefault()
				var imgId = $(this).parent().attr('id')
				var imgSrc = $(this).prev().prev().attr('src')

				$.post('/updateProfilePhoto', {imgId: imgId}, function(data) {
					$('#profile-userpic img').attr('src', imgSrc)
				})
			})
		})

	}
	// end upload photos


	// interets

	loadUserInterests()

	function loadUserInterests() {
		// var user = $('#login').text()
		var interestList = $('#interestList')
		interestList.html('')
		$.post('/loadUserInterests', {user: user}, function(interests) {
			for(i in interests) {
				$('#'+interests[i].name+'-tag').attr('checked',true)
				interestList.append('<li># ' + interests[i].name + '</li>')
			}
		})
	}

	$('#edit-interest').on('click', function(e) {
		e.preventDefault()
		$('#profileinterets').hide('slow')
		$('#profileinterets-edit').show('slow')
	})

	$('#validate-interest-edit').on('click', function(e) {
		e.preventDefault()
		var list = []
		$('input[name=tags]:checked').each(function() {
			list.push( $(this).val() )
		})
		$.post('/updateUserInterests', {tagList: list }, function(err) {
			if (err) {
				$('#profileinterets-error').text(err)
			}
			loadUserInterests()
		})
		$('#profileinterets-edit').hide('slow')
		$('#profileinterets').show('slow')

	})


	// Like

	$('#like').on('click', function(e) {
		e.preventDefault()
		if ($(e.currentTarget).hasClass('button-like-liked')) {
			$.post('/removeLiker', {user}, function(err) {
					$(e.currentTarget).html('<i class="glyphicon glyphicon-heart-empty"></i>Tu me plait !')
					$(e.currentTarget).toggleClass('button-like-liked')
					$('#discution').remove()
					$('#chat-window').remove()
			})
		} else {
			$.post('/addLiker', {user}, function() {
					$(e.currentTarget).html('<i class="glyphicon glyphicon-heart"></i>Tu ne me plait plus !')
					$(e.currentTarget).toggleClass('button-like-liked')
			})
		}
	})







});
