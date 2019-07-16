'use strict'

const mogoose =require('mongoose')
const connect =  require('../../../database/collections/connect')
const Registro = require('../../../database/collections/users')

//se aumento para home
const Producto = require('../../../database/collections/productos')
const Img = require('../../../database/collections/img')
const express = require('express')


//esta variables toma el valor de la IP
const HOST = require('../../../database/collections/HOST')

//////////////////////// multer para imagenes
const multer = require('multer');
//se aumento fs
const fs = require('fs')

const route = express.Router()

// metodos de peticion GET, POTS, PUT, DELETE

route.get('/', (req, res) =>{
    res.send({ menssage:'SERVICIO API-RES TIENDA MOVIL'})
})


//////////////list of homes//////////////
var storage = multer.diskStorage({
    destination: "./public/avatars",
    filename: function (req, file, cb) {
      console.log("-------------------------");
      console.log(file);
      cb(null, "IMG_" + Date.now() + ".jpg");
    }
  });
  var upload = multer({
    storage: storage
  }).single("img");;


route.post('/productoimg', (req, res) => {
    //var url = req.url;
    //console.log(url);
    var id = productoid;
    upload(req, res, (err) => {
      if (err) {
        res.status(500).json({
          "msn" : "No se ha podido subir la imagen"
        });
      } else {
        var ruta = req.file.path.substr(6, req.file.path.length);
        console.log(ruta);
        var img = {
          idproducto: id,
          name : req.file.originalname,
          physicalpath: req.file.path,
          relativepath: `${HOST}:7777`
          //////////////////////////////7////////////relativepath: `${HOST}:4030`
                        //  http://192.168.1.5:4030
        };
        var imgData = new Img(img);
        imgData.save().then( (infoimg) => {
          //content-type
          //Update User IMG
          var producto = {
            gallery: new Array()
          }
          Producto.findOne({_id:id}).exec( (err, docs) =>{
        console.log(docs);
        var data = docs.gallery;
        var aux = new  Array();
        if (data.length == 1 && data[0] == "") {
          producto.gallery.push(`${HOST}:7777/api/v1.0/productoimg/` + infoimg._id)
                          //  ("http://localhost:4030/api/v1.0/homeimg/" + infoimg._id)
        } else {
          aux.push(`${HOST}:7777/api/v1.0/productoimg/` + infoimg._id);
                //  ("http://localhost:4030/api/v1.0/homeimg/" + infoimg._id
          data = data.concat(aux);
          producto.gallery = data;
        }
        ////////////////////////////////////////////////////////////////Producto.useFindAndModify({_id : id}, producto, (err, params) => {
        Producto.findOneAndUpdate({_id : id}, producto, (err, params) => {

          //useFindAndModify
            if (err) {
              res.status(500).json({
                "msn" : "error en la actualizacion del usuario"
              });
              return;
            }
            res.status(200).json(
              req.file
            );
            return;
        });
      });
    });
  }
});
});



route.get(/productoimg\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  console.log(id)
  Img.findOne({_id: id}).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn": "Sucedio algun error en el servicio"
      });
      return;
    }
    //regresamos la imagen deseada
    var img = fs.readFileSync("./" + docs.physicalpath);
    //var img = fs.readFileSync("./public/avatars/img.jpg");
    res.contentType('image/jpeg');
    res.status(200).send(img);
  });
});



//var homeid;
var productoid;

///////////////////////////// var homeid = productoid
///////////route.post("/home", (req, res) => {
  route.post("/producto", (req, res) => {
    //Ejemplo de validacion
  console.log("request; ",req.body)

    var producto = {
      city: req.body.city,
      categoria: req.body.categoria,
      estado : req.body.estado,

      nombre : req.body.nombre,
      precio : req.body.precio,
      cantidad : req.body.cantidad,
      descripcion : req.body.descripcion,
      gallery : "",
      contacto: req.body.contacto
    };

  ///  var homeData = new Home(home);
  var productoData = new Producto(producto)

    productoData.save().then( (rr) => {
      //content-type
      productoid=rr._id;                           //variable que guarda el id de home
      res.status(200).json({
        "id" : rr._id,
        "msn" : "producto registrado con exito "
      });
    });
  });
/*
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

*/

  route.get("/producto", (req, res, next) => {
      var params = req.query;

      var datos = Producto.find({precio: params.precio});
      console.log(datos);
      var city = params.city;
      var categoria = params.categoria;
      var estado = params.estado;
      var nombre = params.nombre;
      var precio = params.precio;
      var cantidad= params.cantidad;
      var over = params.over;

      if (precio == undefined && over == undefined) {
  // filtra los datos que tengan en sus atributos lat y lon null;
  Producto.find({lat:{$ne:null},lon:{$ne:null}}).exec( (error, docs) => {
  res.status(200).json(
    {
      info: docs
    }
  );
  })
  return;
  }
  if (over == "equals") {
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:precio},{cantidad:cantidad}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
        console.log("----------------estos sons iguales-----------------")
      })
      return;
    }else if ( over == "true") {
        console.log("----------------estos sons mayores igual-----------------")
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:{$gte:precio}},{cantidad:{$gte:cantidad}}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
      })
    }else if (over == "false") {
        console.log("----------------estos son los menores/igual-----------------")
      Producto.find({$and:[{city:city},{categoria:categoria},{estado:estado},{precio:{$lte:precio}},{cantidad:{$lte:cantidad}}]}).exec( (error, docs) => {
        res.status(200).json(
          {
            info: docs
          }
        );
      })
    }
    });

//////////////////////////////7restaurantes reutilizado
/*route.get("/producto" ,(req, res) => {
  var skip = 0;
  var limit = 10;
  if (req.query.skip != null) {
    skip = req.query.skip;
  }

  if (req.query.limit != null) {
    limit = req.query.limit;
  }
  Producto.find({}).skip(skip).limit(limit).exec((err, docs) => {
    if (err) {
      res.status(500).json({
        "msn" : "Error en la db"
      });
      return;
    }
    res.status(200).json(docs);
  });
});*/



















    // muestra la peticin de acuerdo a un paraetro de busqueda
      route.get("/producto2/search=:srt", (req, res, next) => {
        console.log(req.params)
        let search =req.params.srt

        Producto.find({estado:new RegExp(search, 'i')}).exec( (error, docs) => {
          res.status(200).json(
            {
              info: docs
            }
          );
        })
    });




    //home busqueda por _id homee//////
    route.get('/productoid/:id', (req, res) => {
      var idh = req.params.id;
      console.log(idh)
      Producto.findById({_id:idh}).exec((err, docs) => {
        if (err) {
          res.status(500).json({
            "msn": "Hay algun error en la busqueda"

          });
          return;
        }
        res.status(200).send(docs);
      });
    });
    ///////////////// end homes/////////////////


























route.get('/list/:email', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)
    let email =req.params.email

    Registro.find({"email":email}, (err, user) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(!user) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':user})
    })
})

route.get('/login/:email=:password', (req, res) =>{
    //res.send({ email:`${req.params.email}`,password:`${req.params.pass}`})
    console.log(req.params)

    let email =req.params.email
    let password=req.params.password

    Registro.find({"email":email,"password":password}, (err, user) =>{
        if(err) return res.status(500).send({menssage:`Error en la peticion: ${err}`})
        if(user.length == 0) return res.status(404).send({message:`usuario no existe`})

        res.status(200).send({'email':user})
    })
})

route.patch(/producto\/[a-z0-9]{1,}$/, (req, res) => {
  var url = req.url;
  var id = url.split("/")[2];
  var keys = Object.keys(req.body);
  var producto = {};
  for (var i = 0; i < keys.length; i++) {
    producto[keys[i]] = req.body[keys[i]];
  }
  console.log(producto);
  //////////////////////////////////////////////////////////////////7Producto.useFindAndModify({_id: id}, producto, (err, params) => {
    Producto.findOneAndUpdate({_id: id}, producto, (err, params) => {

    ///useFindAndModify  .
      if(err) {
        res.status(500).json({
          "msn": "Error no se pudo actualizar los datos"
        });
        return;
      }
      res.status(200).json(params);
      return;
  });
});




//registro de usuarios
route.post('/registro', (req, res) =>{
    console.log('POST /api/registro')
    console.log(req.body)

    let registro = new Registro()
    registro.name =req.body.name
    registro.lastname = req.body.lastname
    registro.phone = req.body.phone
    registro.email = req.body.email
    registro.password = req.body.password




    Registro.findOne({'email':registro.email},(err,e)=>{
        if(e){
            console.log('email repetido')
            res.status(404).send({message:`Este email ${registro.email} ya se encuentra registrado`})
        }
        else{
            registro.save((err, usertStored) =>{
                if(err) {
                  res.status(404).send({messaje: `Error al salvar la base de datos:${err}`})
                 console.log(err)
                }
                res.status(200).send(usertStored)
            })
        }

        //res.status(404).send

    })
/* /////////////////
    registro.save((err, usertStored) =>{
        if(err) res.status(500).send({messaje: `Error al savar la base de datos:${err}`})

        //res.status(200).send({usertStored})
    })
 *///////
})



///metodo para actualizar las direcciones de la imagenes (al cambiar de red)  ///////

route.get('/actualizarIP/:ip',(req,res)=>{
  let nuevaIP = req.params.ip
  Producto.find({},(err,docs)=>{

    docs.map(producto=>{
      let id=producto._id
      let newImgGallery=[]
      // res.send(home.gallery)
      for(let i=0;i<producto.gallery.length;i++){
        let imgGallery= producto.gallery[i]
        let ipImg=imgGallery.split('/')
        ipImg[2]=nuevaIP
        let stringIP = `${ipImg[0]}//${ipImg[2]}/${ipImg[3]}/${ipImg[4]}/${ipImg[5]}/${ipImg[6]}`

        newImgGallery.push(stringIP)

      };
      producto.gallery = newImgGallery
    ///////////////////////////////////////////////////////  Producto.useFindAndModify({_id : id}, producto, (err, params) => {
        //useFindAndModify
      Producto.findOneAndUpdate({_id : id}, producto, (err, params) => {

        if(err){
          res.send({error:'eroor en la actualizacion'})
        }else{
          return
        }
      })

    })
  })

  res.send({message: `IP's actualidas a ${nuevaIP}`})

})


// mostra todos nombres de productos////////////////////////////////
route.get("/nombre", (req, res, next) => {

  Producto.find({}).exec((err, datos) =>{

    var nombre

    nombre = datos.map(data=>(
       {
        _id:data._id,
        nombre: data.nombre,
        //lat: data.lat
      }
    ))
    //console.log(vecindario);

    console.log(datos)
    console.log(err);

      res.status(200).json(nombre)
  })
})


// Muestra los nombres de productos en funcion de una parametro de busqueda
route.get("/nombre/search=:srt", (req, res, next) => {
  console.log(req.params)
  let search =req.params.srt

  Producto.find({nombre:new RegExp(search, 'i')}).exec( (error, docs) => {
    res.status(200).json(
      {
        info: docs
      }
    );
  })
});







module.exports = route
