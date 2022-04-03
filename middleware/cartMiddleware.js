const CartModel = require("../src/models/cart");

class CartMiddleware {
    static updateCartMiddleware({ _id, newItem, res }) {
        CartModel.findOneAndUpdate(
            { customer: _id },
            {
                $push: {
                    items: {
                        $each: [newItem.item],
                        $position: 0,
                    },
                },
                totalAmount: newItem.totalAmount,
                totalQuantity: newItem.totalQuantity,
            },
            { new: true, upsert: true },
            (err, resp) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        messgae: "Sorry an error occured",
                    });
                } else {
                    return res.status(200).json({
                        message: "Successfully added menu to cart",
                        data: resp,
                    });
                }
            }
        );
    }

    static updateDuplicateItems({
        _id,
        duplicateMenuItems,
        res,
        newItem,
        quantity,
    }) {
        CartModel.findOneAndUpdate(
            { customer: _id, "items.name": duplicateMenuItems.name },

            {
                $inc: {
                    "items.$.quantity": quantity,
                },

                $set: {
                    totalAmount: newItem.totalAmount,
                    totalQuantity: newItem.totalQuantity,
                },
                $inc: {
                    totalAmount: newItem.totalAmount,
                    totalQuantity: newItem.totalQuantity,
                },
            },
            (err, resp) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        messgae: "Sorry an error occured",
                    });
                } else {
                    return res.status(200).json({
                        message: "Successfully added menu to cart",
                        data: resp,
                    });
                }
            }
        );
    }

    static removeItemFromCart({
        _id,
        menuId,
        totalAmount,
        totalQuantity,
        res,
    }) {
        CartModel.findOneAndUpdate(
            { customer: _id },
            {
                $pull: {
                    items: { menu: menuId },
                },
                $set: {
                    totalAmount: totalAmount,
                    totalQuantity: totalQuantity,
                },
            },
            // { new: true, upsert: true },
            (err, resp) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({
                        messgae: "Sorry an error occured",
                    });
                } else {
                    return res.status(200).json({
                        message: "Successfully removed menu to cart",
                    });
                }
            }
        );
    }

    static cartSuccessResponse(res, data) {
        return res.status(200).json({
            message: "Successfully created a cart",
            data,
        });
    }
}

module.exports = CartMiddleware;
