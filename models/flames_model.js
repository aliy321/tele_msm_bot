const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const flamesSchema = new Schema({
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

const flames = mongoose.model('flames', flamesSchema);
module.exports = flames;