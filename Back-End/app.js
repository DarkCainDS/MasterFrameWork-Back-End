'use strict'

//Cargar modulos de node para crear servidor
let express = require('express');
let bodyParser = require('body-parser');

//Ejecutar express(http)
let app = express();

//Cargar ficheros rutas
let article_routes = require('./routes/article');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

//Añadir prefijos a rutas
app.use('/api',article_routes);

//Ruta o metodo de prueba para el API REST
 /*
app.post('/probando', (req,res) => {
    let hola = req.body.hola;

    return res.status(200).send({
      curso:'Master en Framework JS',
      autor: 'Diego Romero',
      url:'diego.romero.s@hotmail.com'  
    }
       
        `<ul>
        <li>NodeJs</li>
        <li>Angular</li>
        <li>React</li>
        <li>Vue</li>
            </ul>`

            )
});
*/
//Exportar modulos (fichero actual)

module.exports = app;