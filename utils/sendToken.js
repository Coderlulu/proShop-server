/** @format */

import jwt from "jsonwebtoken";
const options = {
	expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
};
const sendToken = (user, statusCode, res) => {
	const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_LIFETIME,
	});
	res
		.status(statusCode)
		.cookie("token", token, options)
		.json({
			success: true,
			user: {
				name: user.name,
				email: user.email,
				isAdmin: user.isAdmin,

				token: token,
			},
		});
};
export default sendToken;
