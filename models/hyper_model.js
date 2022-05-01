const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hyperSchema = new Schema({
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
    info: [{
        level: String,
        info: String,
        cost: String,
    }]
});

const hyper = mongoose.model('hyper', hyperSchema);
module.exports = hyper;
