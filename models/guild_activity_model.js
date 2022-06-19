const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataSchema = new Schema({
    uid: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    stats: {
        type: Array,
        required: true,
    }
});

const dataCollection = mongoose.model('guild_activity', dataSchema);
module.exports = dataCollection;