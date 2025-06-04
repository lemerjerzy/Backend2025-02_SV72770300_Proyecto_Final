import mongoose from "../config/db.js";

const Course = mongoose.model(
    "Course",
    new mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: null
        },
        img: {
            type: String
        },
        value: {
            type: Number,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        }
    }, {
        timestamps: true
    }));

export default Course;
