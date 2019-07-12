'use strict'

const express = require('express')
const mongoose = require('mongoose')


//192.168.99.100
//mongoose.connect('mongodb://localhost:27017/Inmuebles', (err, res) =>{
  mongoose.connect('mongodb://localhost:27017/Tienda', (err, res) =>{

    if(err) throw err
    //console.log('Conexion a la base de datos establecida')
})

module.exports = mongoose
