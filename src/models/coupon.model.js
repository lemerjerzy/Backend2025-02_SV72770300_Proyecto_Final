import mongoose from "../config/db.js";

const Coupon = mongoose.model(
    "Coupon",
    new mongoose.Schema({
        code: {
            type: String,
            required: true,
            unique: true
        },
        discount: {
            type: Number,
            required: true
        },
        expirationDate: {
            type: Date,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }
    },

        {
            timestamps: true
        }

    ))

export default Coupon;