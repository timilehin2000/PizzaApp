// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema(
//     {
//         customer: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "user",
//             required: true,
//             unique: true,
//         },
//         totalAmount: {
//             type: Number,
//             default: 0,
//         },
//         totalQuantity: {
//             type: Number,
//             default: 0,
//         },
//         items: [
//             {
//                 name: String,
//                 quantity: Number,
//                 price: Number,
//                 shippingPrice: Number,
//                 addedDate: Date,
//                 menu: {
//                     type: mongoose.Schema.Types.ObjectId,
//                     ref: "menu",
//                     required: true,
//                 },
//             },
//         ],
//         referenceId: String,
//     },
//     {
//         timestamps: true,
//     }
// );

// const CartModel = mongoose.model("cart", orderSchema);
// module.exports = CartModel;
