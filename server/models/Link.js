const mongoose = require("mongoose");

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    order: {
        type: Number,
        default: 0
    },
    clicks: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Link", linkSchema);