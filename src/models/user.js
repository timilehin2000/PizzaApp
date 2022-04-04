const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        token: {
            type: String,
        },
        cartTotalAmount: {
            type: Number,
            default: 0,
        },
        cartTotalQuantity: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
