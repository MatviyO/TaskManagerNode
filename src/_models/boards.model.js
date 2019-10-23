"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const BoardShema = new Schema({
	name: String,
	items: Array,
}, {
	versionKey: false,
	collection: 'BoardCollection'
});



module.exports = mongoose.model('BoardModel', BoardShema);