const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boostSchema = new Schema({
    level: {
        type: String,
        required: true,
    },
    need: {
        type: String,
        required: true,
    },
    max: {
        type: String,
        required: true
    },
    shards: {
        type: String,
        required: true
    }
});

const BoostNodes = mongoose.model('boost_nodes', boostSchema);
module.exports = BoostNodes;