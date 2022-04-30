const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jewelSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    jewel: [{
            rank: String, info: String
        }]
});

const Jewels = mongoose.model('jewels', jewelSchema);
module.exports = Jewels;