const { response } = require("express");
const { validateMakeOrderPayload } = require("../helpers/validations/order");
const MenuModel = require("../models/menu");
const OrderModel = require("../models/order");

class OrderController {
    static async makeOrder(req, res) {
        const { _id } = req.user;
        const { cartItems } = req.body;

        const { error } = validateMakeOrderPayload(cartItems);
        if (error)
            return res.status(400).json({
                message: {
                    error: error.details[0].message,
                },
            });

        //declare an array to assign ids from user's request
        let idArray = [];

        //loop trhough and push the the array
        for (let i = 0; i < cartItems.length; i++) {
            idArray.push(cartItems[i].menuId);
        }

        let resultsArray = [];

        /**
         * find multiple values from the menu model using the idArray as parameter
         * then push to the result array
         */

        const findMenu = await MenuModel.find({ _id: { $in: idArray } });
        if (!findMenu) {
            return res.status(400).json({
                message: "sorry an error occured",
            });
        }

        resultsArray = findMenu;

        let orderInfo = [];
        let totalOrderAmount = 0;

        resultsArray.map((item, index) => {
            let orderItem = {
                menu: item.id,
                quantity: cartItems[index].quantity,
                itemTotalAmount:
                    cartItems[index].quantity * item.price +
                    cartItems[index].quantity * item.shippingPrice,
            };
            (totalOrderAmount +=
                cartItems[index].quantity * item.price +
                cartItems[index].quantity * item.shippingPrice),
                orderInfo.push(orderItem);
        });

        const newOrder = new OrderModel({
            customer: _id,
            items: orderInfo,
            totalOrderAmount,
        });

        await newOrder.save();
        return res.status(200).json({
            message: "Order has been created",
            data: newOrder,
        });
    }
}

module.exports = OrderController;
