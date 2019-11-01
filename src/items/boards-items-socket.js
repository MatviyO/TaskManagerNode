"use strict";

const BoardItemModel = require('../_models/board-items.model');
const UsersModel = require('../_models/users.model');


module.exports = io => {
	io.on('connection', (socket) => {
		console.log('user connected');

		socket.on('disconnect', () => {
			console.log('user disconnected');
		});


		socket.on('createItems', (dataObj) => {
			const obj = {
				name: dataObj.data.itemName,
				boardId: dataObj.data.idBoard
			};

			BoardItemModel.create(obj, (err, res) => {
				if(err) return console.error('createItems', err);
				io.emit('item', res);
			});
		});


		socket.on('itemsList', () => {
			BoardItemModel.find({}, (err, res) => {
				if(err) return console.error('itemsList', err);
				io.emit('items', res);
			});
		});


		socket.on('deleteItemById', (dataObj) => {
			BoardItemModel.findByIdAndRemove(dataObj.data, (err, res) => {
				if(err) return console.error('deleteItemById', err);
				io.emit('deleteItem', res);
			});
		});


		socket.on('changeItemById', (dataObj) => {
			BoardItemModel.findByIdAndUpdate(dataObj.data.id, {boardId: dataObj.data.newBoardId}, {new: true}, (err, res) => {
				if(err) return console.error('changeItemById', err);
				io.emit('changeItem', res);
			});
		});


		socket.on('putItemById', (dataObj) => {
			BoardItemModel.findByIdAndUpdate(dataObj.data.id, {name: dataObj.data.newName}, {new: true}, (err, res) => {
				if(err) return console.error('putItemById', err);
				io.emit('putItemName', res);
			});
		});

	});
};