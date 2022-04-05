const { response } = require("express");
const {
    initializeTransaction,
    verifyTransaction,
    sendMail,
} = require("../helpers/utils/utils");
const {
    validateMakeOrderPayload,
    validateIntializePayment,
    validateCompletePayment,
} = require("../helpers/validations/order");
const MenuModel = require("../models/menu");
const OrderModel = require("../models/order");

class OrderController {
    static async makeOrder(req, res) {
        const { _id, email } = req.user;
        const { cartItems } = req.body;

        const { error } = validateMakeOrderPayload(cartItems);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
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

        let subject = " Congratulations, Your order has been placed";
        let message = `Hello Dear Customer, Thank you for shopping with PizzaApp!\n It will be packaged and shipped as soon as possible.\n Once the item(s) is out for delivery or available for pick - up you will receive a notification from us `;

        await sendMail(email, subject, message);

        return res.status(200).json({
            message: "Order has been created",
            data: newOrder,
        });
    }

    static async initializePayment(req, res) {
        const { amount, email, orderId } = req.body;

        const { error } = validateIntializePayment(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
            });

        let amountCharged = amount * 100;

        let params = {
            amount: amountCharged,
            email,
        };

        let { isError, data, errorMessage } = await initializeTransaction(
            params
        );

        if (isError) {
            return res.status(401).json({
                messsage: errorMessage,
            });
        }

        OrderModel.findOneAndUpdate(
            {
                _id: orderId,
                totalOrderAmount: amount,
            },
            {
                referenceId: data.reference,
                paymentStatus: "Payment Initialized",
            },
            { new: true },
            (err, resp) => {
                if (err) {
                    return res.status(404).json({
                        message: "Sorry an error occcured",
                    });
                } else {
                    if (resp === null) {
                        return res.status(404).json({
                            message: "Sorry an error occcured, try again",
                        });
                    }

                    return res.status(200).json({
                        message: "Payment Initialized",
                        data: data,
                    });
                }
            }
        );
    }

    static async completePayment(req, res) {
        const { referenceId, orderId } = req.body;

        const { error } = validateCompletePayment(req.body);
        if (error)
            return res.status(400).json({
                message: error.details[0].message,
            });

        let { isError, data, errorMessage } = await verifyTransaction(
            referenceId
        );

        console.log(data);

        if (isError) {
            return res.status(401).json({
                messsage: errorMessage,
            });
        }

        OrderModel.findOneAndUpdate(
            {
                _id: orderId,
            },
            {
                paymentStatus: "Payment Completed",
            },
            { new: true },
            (err, resp) => {
                if (err) {
                    return res.status(404).json({
                        message: "Sorry an error occcured",
                    });
                } else {
                    if (resp === null) {
                        return res.status(404).json({
                            message: "Sorry an error occcured, try again",
                        });
                    }

                    return res.status(200).json({
                        message: "Payment Completed",
                        data: resp,
                    });
                }
            }
        );
    }
}

module.exports = OrderController;
