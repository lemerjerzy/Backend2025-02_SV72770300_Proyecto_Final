import mongoose from "../config/db.js";

const Cart = mongoose.model(
    "Cart",
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
        status: {
            type: String
        }
    }, {
        timestamps: true
    }));

export default Cart;