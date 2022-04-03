const {
    updateCartMiddleware,
    cartSuccessResponse,
    checkForDuplicateItems,
    checkForDuplicateItemsAndUpdate,
    updateDuplicateItems,
    removeItemFromCart,
} = require("../middleware/cartMiddleware");
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

        let findCart = await CartModel.findOne({ customer: _id });

        if (!findCart) {
            findCart = new CartModel({
                customer: _id,
            });
            findCart.save();
        }

        const menu = await MenuModel.findOne({ _id: menuId });
        if (menu === null)
            return res.status(400).json({
                messgae: "No menu item was found",
            });

        let newItem = {
            item: {
                name: menu.name,
                price: menu.price,
                shippingPrice: menu.shippingPrice,
                quantity,
                menu: menuId,
                addedDate: new Date(),
            },
            totalAmount:
                findCart.totalAmount +
                menu.price * quantity +
                menu.shippingPrice * quantity,
            totalQuantity: findCart.totalQuantity + quantity,
        };

        //check if the incoming menu item has been added before now
        let duplicateMenuItems = findCart.items.find(
            (item) => item.menu.toString() === menu._id.toString()
        );

        if (duplicateMenuItems) {
            duplicateMenuItems.name = newItem.item.name;
            duplicateMenuItems.price = newItem.item.price;
            duplicateMenuItems.quantity += newItem.item.quantity;
            duplicateMenuItems.shippingPrice = newItem.item.shippingPrice;
            duplicateMenuItems.price = newItem.item.price;

            updateDuplicateItems({
                _id,
                duplicateMenuItems,
                res,
                newItem,
                quantity,
            });
        } else {
            updateCartMiddleware({ _id, newItem, res });
        }
    }

    static async removeMenuItemFromCart(req, res) {
        const { _id } = req.user;
        const { menuId, quantity } = req.body;

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

        let findCart = await CartModel.findOne({ customer: _id });
        if (!findCart) {
            return res.status(400).json({
                message: "You do not have this menu item in your cart",
            });
        }

        if (findCart.items.length === 0) {
            findCart.totalQuantity = 0;
            findCart.totalAmount = 0;

            // return res.status(200).json({
            //     message: "Successfully fetched cart",
            //     data: findCart,
            // });
        }

        let duplicateMenuItems = findCart.items.find(
            (item) => item.menu.toString() === menu._id.toString()
        );

        if (duplicateMenuItems) {
            if (quantity > duplicateMenuItems.quantity) {
                return res.status(400).json({
                    message:
                        "You cannot delete more than you have in your cart",
                });
            }
            let totalAmount =
                findCart.totalAmount -
                duplicateMenuItems.price * duplicateMenuItems.quantity -
                duplicateMenuItems.shippingPrice * duplicateMenuItems.quantity;

            let totalQuantity = findCart.totalQuantity - quantity;

            removeItemFromCart({
                _id,
                menuId,
                totalAmount,
                totalQuantity,
                res,
            });
        }
    }

    static fetchCart(req, res) {
        const { _id } = req.user;
        CartModel.findOne({ customer: _id }, (err, resp) => {
            if (err) {
                return res.status(400).json({
                    message: "Sorry an error occured",
                });
            } else {
                if (resp === null) {
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
