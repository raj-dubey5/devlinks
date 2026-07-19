const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    accountType: {
        type: String,
        enum: ["Developer", "Designer", "Student", "Freelancer", "Other"],
        default: "Developer"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileViews: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model("User", userSchema);