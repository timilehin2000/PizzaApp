const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

const {
    validateUserRegistration,
    validateUserLogin,
} = require("../helpers/validations/user.validation");

const { generateToken } = require("../helpers/utils/utils");
const res = require("express/lib/response");

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

        let token = generateToken(email);
        newUser.token = token;

        try {
            await newUser.save();

            return res.status(200).json({
                message: "Successfully registered!",
                data: newUser,
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

        let token = generateToken(email);

        UserModel.findOneAndUpdate(
            { email },
            { token },
            { useFindAndModify: true },
            (err, resp) => {
                //check if the user's status is active

                // verify if password matches or not
                if (bcrypt.compareSync(password, resp.password)) {
                    return res.header("x-access-token", token).json({
                        message: "Login succesful.",
                        data: {
                            // 'firstName': resp.firstName,
                            // 'lastName': resp.lastName,
                            email: resp.email,
                            token: token,
                            userType: resp.userType,
                        },
                    });
                } else {
                    res.status(404).json({
                        message: "Incorrect Login details",
                    });
                }
            }
        );
    }

    static async logout(req, res) {
        const user = req.user;

        if (!user) {
            return res.status(400).json({
                message: "User not logged in or registered",
            });
        }

        await UserModel.findOneAndUpdate({ email }, { token: null });
        return res.status(200).json({
            message: "Logged out!",
        });
    }

    static async editDetails(req, res) {
        const { email } = req.user;

        const { firstName, lastName, address } = req.body;

        let updateData = {};

        if (firstName) {
            updateData.firstName = firstName;
        }
        if (lastName) {
            updateData.lastName = lastName;
        }
        if (address) {
            updateData.address = address;
        }

        const updatedData = await UserModel.findOneAndUpdate(
            { email },
            { updateData }
        );

        updatedData.firstName = firstName;
        updateData.lastName = lastName;
        updateData.address = address;

        try {
            return res.status(200).json({
                message: "Update successfully",
                updateData,
            });
        } catch (err) {
            return res.status(400).json({
                message: "Sorry, an error occured",
            });
        }
    }
}

module.exports = UserController;
