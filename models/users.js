const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    uid: {
        type: Number,
        required: true,
    },
    isAdmin: {
        type: String,
        required: true,
    },
});

const Users = mongoose.model('user', userSchema);
module.exports = Users;