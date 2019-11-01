"use strict";

const MessageModel = require('../_models/messages.model');

module.exports = (io) => {

	io.on('connection', (socket) => {
		console.log('user connected in CHAT');


		socket.on('disconnect', () => {
			console.log('user disconnected');
		});


		socket.on('chat', (dataObj) => {
						const obj = {
							date: new Date(),
							content: dataObj.data,
							username: dataObj.userName
						};

						console.log(obj);

						MessageModel.create(obj, err => {
							if (err) return console.error('MessageModel', err);
							io.emit('message', obj);
						});

		});


		socket.on('receiveHistory', () => {
			MessageModel.find({}).
				sort({date: -1}).
				limit(20).
				exec((err, message) => {
					if (err) return console.error('receiveHistory', err);
					let newArr = message.reverse();
					io.emit('history', newArr);
				});
		});

	});
};