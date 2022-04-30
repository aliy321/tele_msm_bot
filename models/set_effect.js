const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const setEffectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    set: [{
        set: String,
        info: String
    }]
});

const SetEffect = mongoose.model('set_effect', setEffectSchema);
module.exports = SetEffect;
