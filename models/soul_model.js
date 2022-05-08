const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soulSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    uid: {
        type: Number,
        required: true,
    },
    data: [{
        name: String,
        stats: String,
    }]
});

const soul = mongoose.model('soul', soulSchema);
module.exports = soul;