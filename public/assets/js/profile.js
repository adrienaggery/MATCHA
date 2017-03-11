$(document).ready(function(){

	$('#edit').on("click", function(e) {
		e.preventDefault();
		$('#profileinfo').hide("slow");
		$('#profileinfo-edit').show("slow");
	});

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
			$("#"+newid).html(value);
			data[name] = value;
		});

		data = JSON.stringify(data)
		$.post('/updateUser', {data: data});

		$('#profileinfo-edit').hide("slow");
		$('#profileinfo').show("slow");
	});

});
