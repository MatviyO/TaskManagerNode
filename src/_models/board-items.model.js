"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const BoardItemShema = new Schema({
	name: String,
	boardId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'BoardModel'
	},
}, {
	versionKey: false,
	collection: 'BoardItemsCollection'
});



module.exports = mongoose.model('BoardItemModel', BoardItemShema);