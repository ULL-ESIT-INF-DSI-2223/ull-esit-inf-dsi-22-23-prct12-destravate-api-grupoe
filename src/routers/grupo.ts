import express from 'express';
import { Grupo } from '../models/grupos.js';
import { User } from '../models/user.js';

export const grupoRouter = express.Router();

//* Añadir 
grupoRouter.post('/', async (req, res) => {
  const grupo = new Grupo(req.body);

  try {

    //? Comprobar que los participantes que se insertan existen.
    if (req.body.participantes) {
      while (req.body.participantes.length) {
        const usuario = req.body.participantes.shift();
        const user = await User.findById(usuario);
        if (!user) {
          return res.status(400).send({error: "Alguno de los participantes no existe en la bbdd"});
        }
      }
    }

    //* calcular ranking
    // Como asumimos que todos los participantes del grupo realizan todas las rutas planificadas, simplmente ordenamos los usuarios
    // por su fecha de llegada al grupo.
    // ordenar por fecha de llegada al grupo
    grupo.clasificacion = grupo.participantes.sort((a, b) => {
      if (a.fecha < b.fecha) {
        return -1;
      }
      if (a.fecha > b.fecha) {
        return 1;
      }
      return 0;
    });

    //* calcular rutas favoritas
    // Buscar el número de coincidencias de cada ruta en el histórico de rutas del grupo, para ver la más repetida.
    // Si el array de rutas favoritas está vacio devolvemos un error, si no, se recorre y se cuenta las coincidencias.
    // if (grupo.historico_rutas.length === 0) {
    //   return res.status(400).send({error: "No se puede calcular la ruta favorita de un grupo sin historico de rutas"});
    // }
    // else {
    // recorremos el histórico de rutas, nos quedamos con la que más se repite y la añadimos al array de rutas favoritas.
      // const frecuencia: { [key: string]: number } = {};
    
      // grupo.historico_rutas.forEach((elemento) => {
      //   if (frecuencia[elemento.rutas.nombre]) {
      //     frecuencia[elemento.rutas.nombre]++;
      //   } else {
      //     frecuencia[elemento.rutas.nombre] = 1;
      //   }
      // });    
    // }

    await grupo.save();
    return res.status(201).send(grupo);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* GET POR NOMBRE
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

//* GET POR ID
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



//? modificar --> comprobar que el usuario a modificar está en el grupo.

//* MODIFICAR POR id

//* MODIFICAR POR NOMBRE