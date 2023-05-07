import { Track } from '../models/track.js';
import express from 'express';

export const trackRouter = express.Router();

trackRouter.post('/', async (req, res) => {
  const track = new Track(req.body);

  try {
    await track.save();
    return res.status(201).send(track);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* BUSCAR POR NOMBRE
trackRouter.get('/', async (req, res) => {
  const filter = req.query.name?{name: req.query.name.toString()}:{};

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

//* Borrar por name
trackRouter.delete('/', async (req, res) => { 
  if (!req.query.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
  }

  try {
    const tracksDeleted = await Track.deleteMany({name: req.query.name.toString()});

    if (!tracksDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar la ruta"});
    }

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
  //! comprobar que se esta añadiendo un nombre
  if (!req.query.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder actualizarla"});
  }

  const allowedUpdates = ['name', 'coordenadas_inicio_ruta', 'coordenada_fin_ruta', 'longitud', 'desnivel', 'tipo_actividad', 'calificacion_media'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const trackUpdated = await Track.findOneAndUpdate({name: req.query.name.toString()}, req.body, {new: true, runValidators: true});

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
  const allowedUpdates = ['name', 'coordenadas_inicio_ruta', 'coordenada_fin_ruta', 'longitud', 'desnivel', 'tipo_actividad', 'calificacion_media'];
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