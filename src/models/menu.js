const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: false,
        },
        price: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        shippingPrice: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

const MenuModel = mongoose.model("menu", menuSchema);

module.exports = MenuModel;
