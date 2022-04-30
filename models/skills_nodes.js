const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const skillSchema = new Schema({
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

const SkillNodes = mongoose.model('skill_nodes', skillSchema);
module.exports = SkillNodes;