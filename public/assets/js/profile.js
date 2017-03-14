
$(document).ready(function(){

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
					$('#loadPhotos').append('<div id="' + data[i].id + '" class="img-container col-md-4"><img src="' + data[i].path + '" class="img-responsive center-block" /><span class="delete">X</span></div>')
				} else {
					$('#loadPhotos').append('<div id="' + data[i].id + '" class="img-container col-md-4"><img src="' + data[i].path + '" class="img-responsive center-block" /></div>')
				}
			}

			$('.img-container span.delete').on('click', function(e) {

				e.preventDefault()
				var imgId = $(this).parent().attr('id')
				var imgSrc = $(this).prev().attr('src')
				console.log(imgId)
				console.log(imgSrc)

				$.post('/deletePhoto', {imgId: imgId, imgSrc: imgSrc}, function(data) {
					$('#'+imgId).fadeOut('slow', function() {
						$(this).detach()
					})
				})
			})
		})

	}








});
