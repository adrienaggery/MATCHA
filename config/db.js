let mysql      = require('mysql');
let connection = mysql.createConnection({
  host     : 'localhost',
  // port     : 3307,
  user     : 'root',
  password : 'root',
  database : 'matcha'
});
 
connection.connect(function(err) {
	if (err) {
		console.log('error connecting : ' + err.stack)
		return
	}
	console.log('connected as id ' + connection.threadId)
});

module.exports = connection