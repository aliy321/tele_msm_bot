const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageScheme = new Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    }
});

const Images = mongoose.model('images', imageScheme);
module.exports = Images;