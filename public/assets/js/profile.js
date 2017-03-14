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
			$("#"+newid).text(value);
			data[name] = value;
		});

		data = JSON.stringify(data)
		$.post('/updateUser', {data: data});

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

		$.get('/loadPhotos', function(data) {
			$('#loadPhotos').html('')
			for (i in data) {
				// console.log(data[i].path)
				$('#loadPhotos').append('<img src="' + data[i].path + '" class="img-responsive col-md-4 profilePhoto" />')
			}

		})

	}


});
