'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imgSchema = Schema({
    name: String,

    idproducto: String,
    physicalpath: String,
    relativepath: String
});

module.exports = mongoose.model('img',imgSchema);
