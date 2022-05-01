const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const longSpearSchema = new Schema({
    level: String,
    unique: String,
    legend: String,
    mythic: String
});

const LongSpear = mongoose.model('long_spear', longSpearSchema);
module.exports = LongSpear;
