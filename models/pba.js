const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pbaSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    info: [{
        info_type: String,
        normal: String,
        inno: String,
        emblem: String,
    }]
});

const Pba = mongoose.model('pba', pbaSchema);
module.exports = Pba;
