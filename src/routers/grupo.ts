import express from 'express';
import { Grupo } from '../models/grupos.js';
import { User } from '../models/user.js';

export const grupoRouter = express.Router();

/**
 * @Description post de grupo 
 * @Description Inserta en la base de datos un grupo
 */
grupoRouter.post('/', async (req, res) => {
  const grupo = new Grupo(req.body);

  try {

    //* calcular ranking
    // Como asumimos que todos los participantes del grupo realizan todas las rutas planificadas, simplmente ordenamos los usuarios
    // por su fecha de llegada al grupo.
    grupo.clasificacion = grupo.participantes.sort((a, b) => {
      if (a.fecha < b.fecha) {
        return -1;
      }
      if (a.fecha > b.fecha) {
        return 1;
      }
      return 0;
    });

    await grupo.save();
    return res.status(201).send(grupo);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de grupo 
 * @Description Obtiene los datos de un grupo filtrando por su nombre
 */
grupoRouter.get('/', async (req, res) => { 
  const filter = req.query.nombre?{nombre: req.query.nombre.toString()}:{};

  try {
    const groupToFind = await Grupo.find(filter);

    if (groupToFind.length !== 0) {
      return res.status(200).send(groupToFind);
    }
    return res.status(400).send({error: "No se encontró un grupo con ese nombre en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de grupo 
 * @Description Obtiene los datos de un grupo filtrando por su id
 */
grupoRouter.get('/:id', async (req, res) => {
  try {
    const groupToFInd = await Grupo.findById(req.params.id);

    if (groupToFInd) {
      return res.status(200).send(groupToFInd);
    }
    return res.status(400).send({error: "No se encontró un grupo con ese id en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* BORRAR GRUPO POR nombre
grupoRouter.delete('/', async (req, res) => { 
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de grupo para poder borrarla"});
  }

  try {
    const grupoDeleted = await Grupo.deleteMany({nombre: req.query.nombre.toString()});

    if (!grupoDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar el grupo, no existe en la base de datos"});
    }

    return res.status(200).send(grupoDeleted);
  } catch (error) {
    return res.status(400).send(error);
  }
});


//* BORRAR GRUPO POR ID
grupoRouter.delete('/:id', async (req, res) => {
  try {
    const grupoFoundandDeleted = await Grupo.findByIdAndDelete(req.params.id);

    if (!grupoFoundandDeleted) {
      return res.status(400).send({error: "No se encontró el grupo con ese id en la base de datos"});
    }

    return res.status(200).send(grupoFoundandDeleted);
  } catch(error) {
    return res.status(400).send(error);    
  }
});

//* Modificar por id
grupoRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['nombre', 'participantes', 'estadisticasGrupales', 'clasificacion', 'rutas_favoritas', 'historico_rutas'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const grupoUpdated = await Grupo.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (grupoUpdated) {
      return res.status(200).send(grupoUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error); 
  }
});

//* Modificar por Nombre
grupoRouter.patch('/', async (req, res) => {
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder actualizarla"});
  }

  const allowedUpdates = ['nombre', 'participantes', 'estadisticasGrupales', 'clasificacion', 'rutas_favoritas', 'historico_rutas'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const gruposUpdated = await Grupo.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true});

    if (gruposUpdated) {
      return res.status(200).send(gruposUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});