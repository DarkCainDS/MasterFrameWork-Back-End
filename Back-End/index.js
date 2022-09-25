'use strict'
 
let mongoose = require("mongoose");
let app = require('./app');
let port = 3900;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/api_rest_blog', { useNewUrlParser: true })
    .then(() => {
    console.log("La conexión a la base de datos se ha realizado!!");
    //crear servidor y ponerme a escuchar peticiones http
    app.listen(port, () =>{
        console.log("El servidor se a creado correctamente")
    });
});