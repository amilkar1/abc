'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imgSchema = Schema({
    name: String,
<<<<<<< HEAD
    idproducto: String,
=======
    idhome: String,
>>>>>>> 6af5a56a0d2da9a4d5f7664bee7cca1ea7e9c4b6
    physicalpath: String,
    relativepath: String
});

module.exports = mongoose.model('img',imgSchema);
<<<<<<< HEAD
=======

>>>>>>> 6af5a56a0d2da9a4d5f7664bee7cca1ea7e9c4b6
