const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statsCapSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    stats: {
        type: String,
        required: true,
    }
});

const StatsCap = mongoose.model('stats_cap', statsCapSchema);
module.exports = StatsCap;