const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

const {
    validateUserRegistration,
    validateUserLogin,
} = require("../helpers/validations/user.validation");

const { generateToken } = require("../helpers/utils/utils");

class UserController {
    static async registerUser(req, res) {
        const { firstName, lastName, email, password, address } = req.body;

        const { error } = validateUserRegistration(req.body);
        if (error)
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });

        //check if user has b registered before
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Sorry an error occured!, email already exists",
            });
        }

        //hash user's password
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        //register the user
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password: hashPassword,
            address,
        });

        let token = generateToken(newUser);

        try {
            await newUser.save();

            return res.status(200).json({
                message: "Successfully registered!",
                data: newUser,
                token,
            });
        } catch (err) {
            return res.status(404).json({
                message: "Sorry, an error occured",
            });
        }
    }

    static async login(req, res) {
        const { email, password } = req.body;
        //validate payload
        const { error } = validateUserLogin(req.body);
        if (error) {
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });
        }

        //check if user exists
        const existingUser = await UserModel.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: "Email or password is invalid",
            });
        }

        //check if the user's password is the same as the one in the db
        const comparePassword = bcrypt.compareSync(
            password,
            existingUser.password
        );
        if (!comparePassword) {
            return res.status(400).json({
                message: "Email or password is invalid",
            });
        }

        //generate token for the loggedin user
        let token = generateToken(existingUser);

        try {
            return res.header("auth-token", token).json({
                status: "Login succesfull",
                token,
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                message: "Sorry, an error occured",
            });
        }
    }
}

module.exports = UserController;
