import mongoose from "../config/db.js";
const User = mongoose.model(
    "User",
    new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        roles: {
            type: Array,
            default: []
        },
        active: {
            type: Boolean,
            default: true
        }
    }, {
        timestamps: true
    })
);

export default User;