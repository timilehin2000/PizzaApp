const {
    addMenuToCartValidation,
    removeMenuFromCartValidation,
} = require("../helpers/validations/cart");
const CartModel = require("../models/cart");
const MenuModel = require("../models/menu");

class CartController {
    static async addMenuToCart(req, res) {
        const { _id } = req.user;
        const { menuId, quantity } = req.body;

        const { error } = addMenuToCartValidation(req.body);
        if (error)
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });

        const menu = await MenuModel.findOne({ _id: menuId });
        if (menu === null)
            return res.status(400).json({
                messgae: "No menu item was found",
            });

        let newItem = new CartModel({
            customer: _id,
            item: menuId,
            quantity,
        });

        try {
            const savedItem = await newItem.save();
            return res.status(200).json({
                message: "successfully saved new item in cart",
                data: savedItem,
            });
        } catch (err) {
            console.log(err);
            return res.status(404).json({
                message: "An error occured",
            });
        }
    }

    static async removeMenuItemFromCart(req, res) {
        const { _id } = req.user;
        const { menuId } = req.body;

        const { error } = removeMenuFromCartValidation(req.body);
        if (error)
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });

        let menu = await MenuModel.findOne({ _id: menuId });

        if (menu === null) {
            return res.status(200).json({
                message: "Menu item not found",
            });
        }

        let removeCartItem = await CartModel.findOneAndDelete(
            { customer: _id },
            { item: menuId }
        );

        return res.status(200).json({
            message: "Successfully removed item from cart",
            removeCartItem,
        });
    }

    static fetchCart(req, res) {
        const { _id } = req.user;
        CartModel.find({ customer: _id })
            .populate({
                path: "item",
                select: "name price description shippingPrice",
            })
            .populate({
                path: "customer",
                select: "firstName lastName email",
            })
            .exec((err, resp) => {
                if (err) {
                    return res.status(400).json({
                        message: "Sorry an error occured",
                    });
                } else {
                    if (resp.length === 0) {
                        return res.status(200).json({
                            message: "No menu item has been added yet",
                        });
                    }
                    return res.status(400).json({
                        message: "Successfully fetched all menus",
                        data: resp,
                    });
                }
            });
    }
}

module.exports = CartController;
