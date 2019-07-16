'use strict'

const express = require('express')
const mongoose = require('mongoose')


//192.168.99.100
//mongoose.connect('mongodb://localhost:27017/Inmuebles', (err, res) =>{
  mongoose.connect('mongodb://localhost:27017/Tienda', (err, res) =>{

    if(err) throw err
<<<<<<< HEAD
    console.log('Conexion a la base de datos establecida')
=======
    //console.log('Conexion a la base de datos establecida')
>>>>>>> 6af5a56a0d2da9a4d5f7664bee7cca1ea7e9c4b6
})

module.exports = mongoose
