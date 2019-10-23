"use strict";

const UsersModel = require('../_models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');



function createToken (body) {
	return jwt.sign(
		body,
		'6MEJs8tC3sYX72fPB57cvxp',
		{
			expiresIn: '7d'
		}
	);
}


module.exports = (app) => {


	app.post('/login', async (req, res) => {
		console.log(req.body);
		try {
			let user = await UsersModel.findOne({email: req.body.email}).lean().exec();
			if(user != void(0) && bcrypt.compareSync(req.body.password, user.password)) {
				const token = createToken({id: user._id, email: user.email});

				res.status(200).send({'token': token});
			} else res.status(400).send({message: "User not exist or password not correct"});
		} catch (e) {
			console.error('Error, login', e);
			res.status(500).send({message: "some error"});
		}

	});


	app.post('/register', async (req, res) => {

		try {
			let user = await UsersModel.findOne({email: req.body.email}).lean().exec();
			if(user != void(0)) return res.status(400).send({message: 'User already exist'});

			user = await UsersModel.create({
				username: req.body.username,
				email: req.body.email,
				password: req.body.password
			});

			const token = createToken({id: user._id, email: user.email});

			res.status(200).send({'token': token});
		} catch (e) {
			console.error('Error, register', e);
			res.status(500).send({message: "some error"});
		}

	});

};