import mongoose from "../config/db.js";

const Category = mongoose.model(
    "Category",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        description: {
            type: String,
            default: null
        },
        active: {
            type: Boolean,
            default: true
        }
    }, {
        timestamps: true
    }));

export default Category;
