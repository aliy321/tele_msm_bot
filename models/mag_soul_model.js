const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const magSoulSchema = new Schema({
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
        description: String,
    }]
});

const magSoul = mongoose.model('magSoul', magSoulSchema);
module.exports = magSoul;