"use strict";

const BoardModel = require('../_models/boards.model');
const BoardItemModel = require('../_models/board-items.model');
const UsersModel = require('../_models/users.model');
const jwt = require('jsonwebtoken');


module.exports = io => {
	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});


		socket.on('createBoards', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							const obj = {
								name: dataObj.data,
								items: []
							};

							BoardModel.create(obj, (err, res) => {
								if(err) return console.error('createBoards', err);
								io.emit('board', res);
							});
						});

				});
			})(dataObj.token)

		});


		socket.on('boardsList', () => {
			BoardModel.find({}, (err, res) => {
				if(err) return console.error('boardsList', err);
				io.emit('boards', res);
			});
		});


		socket.on('deleteBoardById', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							BoardModel.findByIdAndRemove({ _id: dataObj.data }, (err, res) => {
								if(err) return console.error('deleteBoardById', err);

								BoardItemModel.deleteMany({boardId: res._id}, (err) => {
									if(err) return console.error('deleteBoardById-deleteManyItems', err);
								});

								io.emit('deleteBoard', res);
							});
						});

				});
			})(dataObj.token)

		});


		socket.on('putBoardById', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							BoardModel.findByIdAndUpdate(dataObj.data.id, {name: dataObj.data.newName}, {new: true}, (err, res) => {
								if(err) return console.error('putBoardById', err);
								io.emit('putBoard', res);
							});
						});

				});
			})(dataObj.token)

		});

	});
};