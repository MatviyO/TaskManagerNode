"use strict";

const BoardItemModel = require('../_models/board-items.model');
const UsersModel = require('../_models/users.model');
const jwt = require('jsonwebtoken');


module.exports = io => {
	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});


		socket.on('createItems', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							const obj = {
								name: dataObj.data.itemName,
								boardId: dataObj.data.idBoard
							};

							BoardItemModel.create(obj, (err, res) => {
								if(err) return console.error('createItems', err);
								io.emit('item', res);
							});
						});

				});
			})(dataObj.token)

		});


		socket.on('itemsList', () => {
			BoardItemModel.find({}, (err, res) => {
				if(err) return console.error('itemsList', err);
				io.emit('items', res);
			});
		});


		socket.on('deleteItemById', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							BoardItemModel.findByIdAndRemove(dataObj.data, (err, res) => {
								if(err) return console.error('deleteItemById', err);
								io.emit('deleteItem', res);
							});
						});

				});
			})(dataObj.token)

		});


		socket.on('changeItemById', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							BoardItemModel.findByIdAndUpdate(dataObj.data.id, {boardId: dataObj.data.newBoardId}, {new: true}, (err, res) => {
								if(err) return console.error('changeItemById', err);
								io.emit('changeItem', res);
							});
						});

				});
			})(dataObj.token)

		});


		socket.on('putItemById', (dataObj) => {

			((token) => {
				jwt.verify(token, '6MEJs8tC3sYX72fPB57cvxp', (err, decoded) => {
					if (err) return console.error('decoded', err);

					UsersModel.findOne({email: decoded.email}).
						lean().
						exec((err, res) => {
							if (err) return console.error('UsersModel.findOne', err);
							BoardItemModel.findByIdAndUpdate(dataObj.data.id, {name: dataObj.data.newName}, {new: true}, (err, res) => {
								if(err) return console.error('putItemById', err);
								io.emit('putItemName', res);
							});
						});

				});
			})(dataObj.token)

		});

	});
};