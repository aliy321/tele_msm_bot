const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jewelSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    jewel_info: {
        type: String,
        required: true,
    },
    jewel_type: {
        type: String,
        required: true,
    },
});

const Jewels = mongoose.model('jewels', jewelSchema);
module.exports = Jewels;