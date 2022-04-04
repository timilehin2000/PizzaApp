const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        items: [
            {
                menu: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "menu",
                    required: true,
                },
                quantity: Number,
                itemTotalAmount: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        totalOrderAmount: {
            type: Number,
            default: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Success"],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    }
);

const OrderModel = mongoose.model("order", orderSchema);
module.exports = OrderModel;
