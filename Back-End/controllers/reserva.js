upload: (req,res) => {

    //Configurar el modulo connect multiparty router/article.js(Hecho en el articles/routes)

    //Recoger el fichero de la petición
    var file_name = 'Imagen no subida...';

    if(!req.files){
        return res.status(404).send({
            status:'error',
            message: file_name
        });
    }
    //conseguir nombre y la extension del archivo
    var file_path = req.files.file0.path;
    var file_split = file_path.split('\\');

    /*Advertencia en linux o mac    var file_split =file_path.split('/');*/

    //Nombre del archivo
    var file_name = file_split[2];

    //Extension del fichero
    var extension_split = file_name.split('\.');
    var file_ext = extension_split[1];
    //Comprobar la extension, solo imagenes, si es valida borrar el fichero
    if(file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif'){
        //Borrar el archivo subido
        fs.unlink(file_path, (err) => {
            return res.status(200).send({
                status:'error',
                message: 'LQA EXTENSION DE LA IMAGEN NO ES VALIDA !!!'
            });
        });
    }else{
    //si todo es valido
        var articleId = req.params.id;
    //Buscar el articulo , asignarle el nombre de la imagen y actualizarlo
      Article.findOneAndUpdate({_id: articleId}, {image:file_name}, {new:true}, (err,articleUpdated) =>{
        if(err || !articleUpdated){
            return res.status(200).send({
                status:'Error',
                message: 'Error al guardar la imagen de articulo !!!'
            });
        }
        
        return res.status(200).send({
            status:'Succes',
            article: articleUpdated
        });
    });
    return res.status(200).send({
        fichero: req.files,
        split:file_split,
        file_ext
    });     
    }
    
    getImage: (req,res) => {
        var file = req.params.image;
        var path_file = './upload/articles/'+file;

        fs.exists(path_file, (exists) => {
            console.log(exists);
            if(exists){
                return res.sendFile(path.resolve(path_file));
            }else{
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe !!!'
                });
            }
        });
        return res.status(200).send({
            status: 'Success',
            file
        });
    } 


}, //end upload file