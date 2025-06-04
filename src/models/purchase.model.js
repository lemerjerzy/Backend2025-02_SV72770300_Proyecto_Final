import mongoose from "../config/db.js";

const Purchase = mongoose.model(
    "Purchase",
    new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        courses: [
            {
                course: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Course",
                    required: true
                },
                quantity: {
                    type: Number,
                    default: 1
                }
            }
        ],
        totalAmount: Number,
        currency: {
            type: String,
            default: "PEN"
        },
        paymentId: String,
        paymentDate: {
            type: Date,
            default: Date.now
        },
        discount: {
            type: Number,
        },
        coupon: {
            type: String
        },
        status: {
            type: String
        }
    },
        {
            timestamps: true
        })
);

export default Purchase;

