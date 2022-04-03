const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            // required: true,
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        totalQuantity: {
            type: Number,
            default: 0,
        },
        items: [
            {
                name: String,
                quantity: Number,
                price: Number,
                shippingPrice: Number,
                addedDate: Date,
                menu: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "menu",
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const CartModel = mongoose.model("cart", cartSchema);
module.exports = CartModel;
