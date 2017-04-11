// function infosClavier(e) {
//     console.log("Evènement clavier : " + e.type + ", touche : " + e.keyCode);
// }

// document.addEventListener("keydown", infosClavier)


setInterval(checkCode, 5000)

window.onkeydown = function (e) {
	var code = e.keyCode ? e.keyCode : e.which;
	storeCode(code)
}

var cheat = []
konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]

function storeCode(code) {
	cheat.push(code)
}

function checkCode() {
	for (let i = 0; i < 10; i++) {
		if (cheat[i] !== konami[i]) {
			cheat = []
			return
		}
	}
	cheat = []
	return loadEaster()
}


function loadEaster() {
	var easter = document.getElementsByClassName('container-fluid')[0]
	easter.innerHTML = loadEasterTemplate()
}

function loadEasterTemplate() {
	var template
	template = '<div class="container text-center">'
	template += '<h1>Congratulations, you broke the game !</h1>'
	template += '<hr />'
	template += "<p>You don't like anyone, and shit on this Matcha project !</p>"
	template += '<img src="http://quotesnhumor.com/wp-content/uploads/2014/12/Top-25-Best-Funny-Animal-Photos-Humor.jpg" class="img-responsive center-block" />'
	template += '</div>'


	return template
}




