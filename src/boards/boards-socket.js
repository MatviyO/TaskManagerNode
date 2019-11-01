"use strict";

const BoardModel = require('../_models/boards.model');
const BoardItemModel = require('../_models/board-items.model');


module.exports = io => {
	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});

		socket.on('createBoards', (dataObj) => {
			const obj = {
				name: dataObj.data,
				items: []
			};

			BoardModel.create(obj, (err, res) => {
				if(err) return console.error('createBoards', err);
				io.emit('board', res);
			});
		});

		socket.on('boardsList', () => {
			BoardModel.find({}, (err, res) => {
				if(err) return console.error('boardsList', err);
				io.emit('boards', res);
			});
		});

		socket.on('deleteBoardById', (dataObj) => {
			BoardModel.findByIdAndRemove({ _id: dataObj.data }, (err, res) => {
				if(err) return console.error('deleteBoardById', err);

				BoardItemModel.deleteMany({boardId: res._id}, (err) => {
					if(err) return console.error('deleteBoardById-deleteManyItems', err);
				});

				io.emit('deleteBoard', res);
			});
		});

		socket.on('putBoardById', (dataObj) => {
			BoardModel.findByIdAndUpdate(dataObj.data.id, {name: dataObj.data.newName}, {new: true}, (err, res) => {
				if(err) return console.error('putBoardById', err);
				io.emit('putBoard', res);
			});
		});
	});
};