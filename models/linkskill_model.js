const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkskillSchema = new Schema({
    uid: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    skill: [{ name: String, stats: String }],
});

const Linkskill = mongoose.model('linkskill', linkskillSchema);
module.exports = Linkskill;
