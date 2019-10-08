const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        id: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
});


const User = mongoose.model("users", UserSchema);
module.exports = User;