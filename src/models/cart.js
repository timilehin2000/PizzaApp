const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "menu",
        },
        quantity: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const CartModel = mongoose.model("cart", cartSchema);
module.exports = CartModel;
