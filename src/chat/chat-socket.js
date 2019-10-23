"use strict";

const MessageModel = require('../_models/messages.model');
const UsersModel = require('../_models/users.model');
const jwt = require('jsonwebtoken');



module.exports = (io) => {

	io.on('connection', (socket) => {
		console.log('user connected in CHAT');


		socket.on('disconnect', () => {
			console.log('user disconnected');
		});


		socket.on('chat', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);

							const obj = {
								date: new Date(),
								content: dataObj.data,
								username: res.username
							};

							MessageModel.create(obj, err => {
								if (err) return console.error('MessageModel', err);
								io.emit('message', obj);
							});
						});

				});
			})(dataObj.token)

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