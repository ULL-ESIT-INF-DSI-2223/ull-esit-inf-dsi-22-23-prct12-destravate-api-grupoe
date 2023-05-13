import { Reto } from '../models/retos.js';
import { Track } from '../models/track.js';
import express from 'express';

export const retoRouter = express.Router();

/**
 * @Description post de reto
 * @Description Inserta en la base de datos un nuevo reto
 */
retoRouter.post('/', async (req, res) => {
  const reto = new Reto(req.body);
  
  reto.kms = 0;
  // calcular los kms de las rutas que incluye el reto
  while(req.body.rutas.length) {
    const ruta = req.body.rutas.shift();
    const track = await Track.findById(ruta);
    if (!track) {
      return res.status(400).send({error: "Alguna de las rutas no existe"});
    }
    reto.kms += track.longitud;
    // console.log("KMS  " + reto.kms);
    // console.log("longitud  " + track.longitud);
  }

  try {
    await reto.save();
    return res.status(201).send(reto);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de reto
 * @Description Obtiene los datos de un reto filtrando por su id
 */
retoRouter.get('/:id', async (req, res) => {
  try {
    const retoFound = await Reto.findById(req.params.id);

    if (retoFound) {
      return res.status(200).send(retoFound);
    }
    return res.status(400).send({error: "No se encontró el resto con ese id en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de reto
 * @Description Obtiene los datos de un reto filtrando por su nombre
 */
retoRouter.get('/', async (req, res) => {
  const filter = req.query.nombre?{nombre: req.query.nombre.toString()}:{};

  try {
    const retosFound = await Reto.find(filter);

    if (retosFound.length !== 0) {
      return res.status(200).send(retosFound);
    }
    return res.status(400).send({error: "No se encontró el reto con ese nombre en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* Borrar por nombre
retoRouter.delete('/', async (req, res) => { 
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
  }

  try {
    const retosDeleted = await Reto.deleteMany({nombre: req.query.nombre.toString()});

    if (!retosDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar la ruta"});
    }

    return res.status(200).send(retosDeleted);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* Borrar por id
retoRouter.delete('/:id', async (req, res) => {
  try {
    const retoFoundandDeleted = await Reto.findByIdAndDelete(req.params.id);

    if (!retoFoundandDeleted) {
      return res.status(400).send({error: "No se encontró el usuario con ese id en la base de datos"});
    }

    return res.status(200).send(retoFoundandDeleted);
  } catch(error) {
    return res.status(400).send(error);    
  }
});

//* Modificar por Nombre
retoRouter.patch('/', async (req, res) => {
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder actualizarla"});
  }

  const allowedUpdates = ['nombre', 'actividad', 'coordenada_fin_ruta', 'rutas', 'usuarios'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const retosUpdated = await Reto.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true});

    if (retosUpdated) {
      return res.status(200).send(retosUpdated);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});

//* Modificar por id
retoRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['nombre', 'actividad', 'coordenada_fin_ruta', 'rutas', 'usuarios'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const retoUpdated = await Reto.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (retoUpdated) {
      return res.status(200).send(retoUpdated);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error); 
  }
});