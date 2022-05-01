const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const legionSchema = new Schema({
    rank: String,
    level: String,
    coin: String,
    max: String
});

const Legion = mongoose.model('legion', legionSchema);
module.exports = Legion;
