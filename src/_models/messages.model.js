"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const MessageShema = new Schema({
	date: Date,
	content: String,
	username: String
}, {
	versionKey: false,
	collection: 'MessageCollection'
})


module.exports = mongoose.model('MessageModel', MessageShema);