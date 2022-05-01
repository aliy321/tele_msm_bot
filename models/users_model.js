const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    uid: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
});

const Users = mongoose.model('user', userSchema);
module.exports = Users;