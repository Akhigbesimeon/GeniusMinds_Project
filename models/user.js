const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    email: { type: String, unique: true },
    role: String,
    password: String
});

module.exports = mongoose.model("User", UserSchema);
