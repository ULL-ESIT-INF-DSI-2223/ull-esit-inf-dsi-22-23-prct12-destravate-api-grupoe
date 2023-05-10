import { Track } from '../models/track.js';
import { User } from '../models/user.js';
import { Reto } from '../models/retos.js';
import express from 'express';

export const trackRouter = express.Router();

//* AÑADIR RUTA
trackRouter.post('/', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    //console.log(error.message.toString());
    return res.status(400).send(error);
  }
});

//* BUSCAR POR NOMBRE
trackRouter.get('/', async (req, res) => {
  const filter = req.query.nombre?{nombre: req.query.nombre.toString()}:{};

  try {
    const tracks = await Track.find(filter);

    if (tracks.length !== 0) {
      return res.status(200).send(tracks);
    }
    return res.status(400).send({error: "No se encontró la ruta con ese nombre"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* BUSCAR POR ID
trackRouter.get('/:id', async (req, res) => {
  try {
    const tracks = await Track.findById(req.params.id);

    if (tracks) {
      return res.status(200).send(tracks);
    }
    return res.status(400).send({error: "No se encontró la ruta con ese id"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* Borrar por nombre
trackRouter.delete('/', async (req, res) => { 
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
  }

  try {
    //? ALMACENAMOS LA ID DE LA RUTA PARA FUTURAS ELIMINACIONES EN OTRAS TABLAS
    const trackDeletedID = await Track.findOne({nombre: req.query.nombre.toString()}).select('id');
    //console.log(trackDeletedID);
    
    //? BORRAR LA RUTA
    const tracksDeleted = await Track.deleteMany({nombre: req.query.nombre.toString()});
    if (!tracksDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar la ruta"});
    }
    
    //? BORRAR EL TRACK DE LA TABLA USUARIOS --> DE LAS RUTAS FAVORITAS
    //recorrer todos los usuarios de la bbdd
    const users = await User.find();
    users.forEach(async (user) => {
      //console.log(user.rutas_favoritas);
      user.rutas_favoritas.forEach(async (ruta, index) => {
        //console.log(ruta.id.troString());
        if(trackDeletedID !== null) {
          // console.log("RUTA: " + ruta.toString());
          // console.log("ID: " + trackDeletedID.id.toString());
          if (ruta.toString() === trackDeletedID.id.toString()) {
            //console.log("ENTRA");
            user.rutas_favoritas.splice(index, 1);
            await user.save();
          }
        } else {
          return res.status(500).send({error: "No se pudo borrar la ruta de la tabla usuarios"});
        }
      });

      //? BORRAR LA ID DEL TRACK DEL HISTORICO DE RUTAS DE LOS USUARIOS
      user.historico_rutas.forEach(async (ruta, index) => {
        if(trackDeletedID !== null) {
          ruta.rutas.forEach(async (ruta2, index2) => {
            if (ruta2.toString() === trackDeletedID.id.toString()) {
              ruta.rutas.splice(index2, 1);
              await user.save();
            }
          });
        } else {
          return res.status(500).send({error: "No se pudo borrar la ruta de la tabla usuarios"});
        }
      });
    });

    //? BORRAR TRACK DE LA TABLA RETOS
    const retos = await Reto.find();
    retos.forEach(async (reto) => {
      reto.rutas.forEach(async (ruta, index) => {
        if(trackDeletedID !== null) {
          if (ruta.toString() === trackDeletedID.id.toString()) {
            reto.rutas.splice(index, 1);
          }
        } else {
          return res.status(500).send({error: "No se pudo borrar la ruta de la tabla retos"});
        }
      });
      await reto.save();
    });

    //?? BORRAR EL TRACK DE LA TABLA GRUPOS --> RUTAS FAV

    //? BORRAR EL TRACK DE LA TABLA GRUPOS --> RUTAS REALIZADAS

    return res.status(200).send(tracksDeleted);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* Borrar por id
trackRouter.delete('/:id', async (req, res) => {
  try {
    const tracksFoundandDeleted = await Track.findByIdAndDelete(req.params.id);

    if (!tracksFoundandDeleted) {
      return res.status(400).send({error: "No se encontró la ruta con ese id"});
    }

    return res.status(200).send(tracksFoundandDeleted);
  } catch(error) {
    return res.status(400).send(error);    
  }
});

//* Actualizar por nombre
trackRouter.patch('/', async (req, res) => {
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder actualizarla"});
  }

  const allowedUpdates = ['nombre', 'coordenadas_inicio_ruta', 'coordenada_fin_ruta', 'longitud', 'desnivel', 'usuarios', 'tipo_actividad', 'calificacion_media'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const trackUpdated = await Track.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true});

    if (trackUpdated) {
      return res.status(200).send(trackUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});

//* Actualizar por id
trackRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['nombre', 'coordenadas_inicio_ruta', 'coordenada_fin_ruta', 'longitud', 'desnivel', 'usuarios', 'tipo_actividad', 'calificacion_media'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const trackUpdated = await Track.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (trackUpdated) {
      return res.status(200).send(trackUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error); 
  }
});