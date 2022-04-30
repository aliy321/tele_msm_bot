const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trioSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    key: {
        type: String,
        required: true,
    },
    skill: [{
        skill: String
    }]
});

const Trio = mongoose.model('trio', trioSchema);
module.exports = Trio;