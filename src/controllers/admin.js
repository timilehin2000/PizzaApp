const {
    validateMenuPayload,
} = require("../helpers/validations/menu.validation");
const {
    validateCreateMenuPayload,
} = require("../helpers/validations/menu.validation");
const MenuModel = require("../models/menu");
const UserModel = require("../models/user.model");

class AdminControler {
    static async deleteAUser(req, res) {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please imput the user's email",
            });
        }

        try {
            const deleteUser = await UserModel.findOneAndDelete({ email });
            if (deleteUser) {
                return res.status(200).json({
                    message: "User deleted",
                });
            } else {
                return res.status(404).json({
                    message: "Sorry an error occured",
                });
            }
        } catch (err) {
            return res.status(404).json({
                message: "Sorry an error occured, Try again",
            });
        }
    }

    static async displayMenu(req, res) {
        const { name, price, description, shippingPrice } = req.body;

        const { error } = validateCreateMenuPayload(req.body);
        if (error)
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });

        const newMenu = new MenuModel({
            name,
            price,
            description,
            shippingPrice,
        });

        try {
            const menu = await newMenu.save();
            return res.status(200).json({
                message: "Successfully created menu",
                data: newMenu,
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                message: "Sorry, an error occurred. Please try again!",
            });
        }
    }
}

module.exports = AdminControler;
