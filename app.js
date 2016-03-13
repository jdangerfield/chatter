var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	nicknames = [];

server.listen(80);

app.get('/',function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection',function (socket) {

	socket.on('new user', function (data, callback) {
		if (nicknames.indexof(data) != -1) {
			callback(false);
		} else {
			callback(true);
			socket.nickname = data;
			nicknames.push(socket.nickname);
			updateNicknames();
		}
	});

	function updateNicknames () {
		io.sockets.emit('usernames', nicknames);
	}

	socket.on('send message', function (data) {
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
	});

	socket.on('disconnect', function (data) {
		if(!socket.nickname) return;
		nicknames.splice(nicknames.indexof(socket.nickname), 1);
	});

});