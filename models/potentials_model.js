const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const potentialSchema = new Schema({
    uid: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    data: [{
        name: String,
        epic: String,
        unique: String,
        legend: String,
    }]
});

const potential = mongoose.model('potential', potentialSchema);
module.exports = potential;
