'use strict'

const mongoose = require('mongoose');
var mon = require('mongoose');

var Schema = mon.Schema;
var productoSchema = new Schema({
  city: String,
  categoria: String,
  estado :String,
  nombre : String,
  precio : Number,
  cantidad : Number,
  contacto : Number,
  descripcion : String,
    gallery : Array,

  date: {type:Date,default:Date.now()}
});
var producto = mongoose.model("productos", productoSchema);
module.exports = producto;
