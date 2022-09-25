'use strict'

let validator = require('validator');
const article = require('../models/article');
let Article = require('../models/article');
var fs = require('fs');
var path = require('path');
const { exists } = require('../models/article');

let controller = {
    datosCursos: (req, res) => {
        let hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framework JS',
            autor: 'Diego Romero',
            url: 'diego.romero.s@hotmail.com',
            hola
        });
    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acccion test de mi controlador de articulos'
        });
    },
    save: (req, res) => {
        //Recoger parametros por post
        let params = req.body;
        console.log(params);

        //validar datos(validator)

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'FAltan datos para enviar !!!'
            });
        }
        if (validate_title && validate_content) {
            /*return res.status(200).send({
                message:"validacion Correcta"

            });*/

            //crear el objeto a guardar
            var article = new Article();

            //asignar valores
            article.title = params.title;
            article.content = params.content;

            if(params.image){
                article.image = params.image;
            }else{
                article.image = null;
            }
          

            //guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado !!!'
                    });
                }
                //devolver una respuesta ** importante que el status coincida con el status esperado donde sea solicitado  **
                return res.status(200).send({
                    status: 'success',
                    article: articleStored

                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar !!!'
            });
        }

    },
    getArticles: (req, res) => {
        //ruta para sacar ultimo articulos
        var query = Article.find({})

        var last = req.params.last;
        if (last || last != undefined) {
            query.limit(5);
        }

        //Find
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error al devolver los articulos"
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar !!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });



        });

    },
    //obtener articulo indicado
    getArticle: (req, res) => {

        //recoger el id de la url
        var articleId = req.params.id;
        //comproar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'Error',
                message: 'no hay articulos'
            });
        }
        //buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'Error',
                    message: 'No existe el articulo !!!'
                });
            }
            //devolver el json

            return res.status(200).send({
                status: 'Success',
                article
            });
        });

    },
    update: (req, res) => {
        //Recoger el Id del articulo por la url
        var articleId = req.params.id;
        //Recoger los datos que llegan del put
        var params = req.body;
        //Validar datos
        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        } catch (err) {
            return res.status(200).send({
                status: 'Error',
                message: 'Faltan datos para enviar!!!'
            });
        }
        if (validate_title && validate_content) {
            //Find and update
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdated) => {
                if (err) {
                    return res.status(500).send({
                        status: 'Error',
                        message: 'Error al actualizar !!!'
                    });
                }
                if (!articleUpdated) {
                    return res.status(404).send({
                        status: 'Error',
                        message: 'No existe el articulo !!!'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            })
        } else {
            //Devolver la respuesta
            return res.status(200).send({
                status: 'Error',
                message: 'La validación no es correcta !!!'
            });

        }
    },
    delete: (req, res) => {
        //Recoger el id de la url

        var articleId = req.params.id;

        //Find and delete
        Article.findByIdAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(200).send({
                    status: 'Error',
                    message: 'Error al borrar !!!'
                });
            }
            if (!articleRemoved) {
                return res.status(200).send({
                    status: 'Error',
                    message: 'No se ha borrado el articulo, posiblemente no exista !!!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                article: articleRemoved
            });
        });

    },
    upload: (req, res) => {
        // Configurar el modulo connect multiparty router/article.js (hecho)

        // Recoger el fichero de la petición
        var file_name = 'Imagen no subida...';

        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        // Conseguir nombre y la extensión del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        // * ADVERTENCIA * EN LINUX O MAC
        // var file_split = file_path.split('/');

        // Nombre del archivo
        var file_name = file_split[2];

        // Extensión del fichero
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        // Comprobar la extension, solo imagenes, si es valida borrar el fichero
        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {

            // borrar el archivo subido
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'La extensión de la imagen no es válida !!!'
                });
            });

        } else {
            // Si todo es valido, sacando id de la url
            var articleId = req.params.id;

            if (articleId) {
                // Buscar el articulo, asignarle el nombre de la imagen y actualizarlo
                Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {

                    if (err || !articleUpdated) {
                        return res.status(200).send({
                            status: 'error',
                            message: 'Error al guardar la imagen de articulo !!!'
                        });
                    }

                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    });
                });
            } else {
                return res.status(200).send({
                    status: 'success',
                    image: file_name
                });
            }

        }
    }, // end upload file
    getImage: function (req, res) {
        var fileName = req.params.image
        var pathFile = './upload/articles/' + fileName;

        fs.stat(pathFile, (err, exists) => {
            if (exists) {
                return res.sendFile(path.resolve(pathFile));
            } else {
                return res.status(404).send({
                    message: 'No existe la imagen'
                });
            }
        });
    },

    search: (req, res) => {
        //Sacar el string a buscar
        var search_string = req.params.search;
        //Find or
        Article.find({
            "$or": [
                { "title": { "$regex": search_string, "$options": "i" } },
                { "content": { "$regex": search_string, "$options": "i" } }
            ]
        })
            .sort([['date', 'descending']])
            .exec((err, articles) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: ' Error en la peticion'
                    })
                }
                if (!articles || articles.length <= 0) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No hay articulos que coincidan con tu busqueda !!!'
                    });
                }
                return res.status(200).send({
                    status: 'Success',
                    articles
                });
            });

    }
}; // end controller

module.exports = controller;