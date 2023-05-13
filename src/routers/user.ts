import { User } from '../models/user.js';
import { Reto } from '../models/retos.js';
import { Grupo } from '../models/grupos.js';
import { Track } from '../models/track.js';
import express from 'express';

export const userRouter = express.Router();

/**
 * @Description post de usuario
 * @Description Inserta en la base de datos un usuario
 */
userRouter.post('/', async (req, res) => {
  const newUser = new User(req.body);

  try {
    //? comprobar si en la base de datos de usuarios existen esos usuarios
    if (req.body.amigos) {
      //iterar sobre el array de amigos
      while (req.body.amigos.length) {
        //sacar el primer elemento del array
        const amigo = req.body.amigos.shift();
        //buscar en la bbdd de usuarios ese id
        const user = await User.findById(amigo);
        //si no existe, devolver error
        if (!user) {
          return res.status(400).send({error: "Alguno de los amigos no existe"});
        }
      }
    }

    //?? Checkeamos si hay grupos de amigos, que todos sus miembros sean usuarios registrados en la bbdd
    if (req.body.grupos) {
      while(req.body.grupos.length) {
        const grupo = req.body.grupos.shift();
        while(grupo.miembros.length) {
          const miembro = grupo.miembros.shift();
          const user = await User.findById(miembro);
          if (!user) {
            return res.status(400).send({error: "Alguno de los miembros del grupo no existe"});
          }
        }
      }
    }

    //? Metemos al usuario en la bbdd de usuarios
    await newUser.save();
    return res.status(201).send(newUser);

  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de usuario
 * @Description Obtiene los datos de un usuario filtrando por su nombre
 */
userRouter.get('/', async (req, res) => { 
  const filter = req.query.nombre?{nombre: req.query.nombre.toString()}:{};

  try {
    const userToFind = await User.find(filter);
    if (userToFind.length !== 0) {
      return res.status(200).send(userToFind);
    }
    return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description get de usuario
 * @Description Obtiene los datos de un usuario filtrando por su id
 */
userRouter.get('/:id', async (req, res) => {
  try {
    const userToFInd = await User.findById(req.params.id);

    if (userToFInd) {
      return res.status(200).send(userToFInd);
    }
    return res.status(400).send({error: "No se encontró un usuario con ese id en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * @Description delete de usuario
 * @Description borra los datos de un usuario filtrando por su nombre
 */
userRouter.delete('/', async (req, res) => { 
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
  }

  try {

    //? ALMACENAMOS EL ID DEl USUARIO QUE QUEREMOS BORRAR
    const userDeletedID = await User.findOne({nombre: req.query.nombre.toString()}).select('id');
    if (!userDeletedID) {
      return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
    }
    
    
    //? BORRAMOS EL USUARIO
    const userDeleted = await User.deleteOne({nombre: req.query.nombre.toString()});
    if (!userDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar el usuario, no existe en la base de datos"});
    }

    //? BORRAMOS LOS RETOS QUE TENGA ESE USUARIO
    const retos = await Reto.find();
    retos.forEach(async (reto) => {
      reto.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID.id.toString()) {
            reto.usuarios.splice(index,1);
            await reto.save();
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
    });

    // ? BORRAMOS DE LOS AMIGOS DE LOS USUARIOS
    const users = await User.find();
    users.forEach(async (user) => {
      user.amigos.forEach(async (amigo, index) => {
        if (userDeletedID !== null) {
          if (amigo.toString() === userDeletedID.id.toString()) {
            user.amigos.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      user.grupos.forEach(async (grupo) => {
        grupo.miembros.forEach(async (miembro, index) => {
          if (userDeletedID !== null) {
            if (miembro.toString() === userDeletedID.id.toString()) {
              grupo.miembros.splice(index,1);
            }
          }
          else {
            return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
          }
        });
      });
      await user.save();
    });

    
    // ? BORRAMOS EL USUARIO DE GRUPOS
    const grupos = await Grupo.find();
    grupos.forEach(async (grupo) => {
      grupo.participantes.forEach(async (miembro, index) => {
        if (userDeletedID !== null) {
          if (miembro.participante.toString() === userDeletedID.id.toString()) {
            grupo.participantes.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      grupo.clasificacion.forEach(async (clasificacion, index) => {
        if (userDeletedID !== null) {
          if (clasificacion.participante.toString() === userDeletedID.id.toString()) {
            grupo.clasificacion.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"}); 
        }

      });
      await grupo.save();
    });

    //? BORRAR DE LA TABLA TRACK LOS USUARIOS QUE PARTICIPAN EN LA RUTA
    const tracks = await Track.find();
    tracks.forEach(async (track) => {
      track.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID.id.toString()) {
            track.usuarios.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      await track.save();
    });
    return res.status(200).send(userDeleted);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }


});

/**
 * @Description delete de usuario
 * @Description borra los datos de un usuario filtrando por su id
 */
userRouter.delete('/:id', async (req, res) => {

  try {

    //? ALMACENAMOS EL ID DEl USUARIO QUE 
    // const userDeletedID = await User.findOne({id: req.params.id.toString()}).select('id');
    // console.log('User deleted id: ' + req.params.id.toString());
    const userDeletedID = await User.findById(req.params.id);
    if (!userDeletedID) {
      return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
    }
    
    //? BORRAR EL USUARIO
    const userFoundandDeleted = await User.findByIdAndDelete(req.params.id);
    if (!userFoundandDeleted) {
      return res.status(400).send({error: "No se encontró el usuario con ese id en la base de datos"});
    }

    //? BORRAMOS LOS RETOS QUE TENGA ESE USUARIO
    const retos = await Reto.find();
    retos.forEach(async (reto) => {
      reto.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID.id.toString()) {
            reto.usuarios.splice(index,1);
            await reto.save();
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
    });

    // ? BORRAMOS DE LOS AMIGOS DE LOS USUARIOS
    const users = await User.find();
    users.forEach(async (user) => {
      user.amigos.forEach(async (amigo, index) => {
        if (userDeletedID !== null) {
          if (amigo.toString() === userDeletedID.id.toString()) {
            user.amigos.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      user.grupos.forEach(async (grupo) => {
        grupo.miembros.forEach(async (miembro, index) => {
          if (userDeletedID !== null) {
            if (miembro.toString() === userDeletedID.id.toString()) {
              grupo.miembros.splice(index,1);
            }
          }
          else {
            return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
          }
        });
      });
      await user.save();
    });

    
    // ? BORRAMOS EL USUARIO DE GRUPOS
    const grupos = await Grupo.find();
    grupos.forEach(async (grupo) => {
      grupo.participantes.forEach(async (miembro, index) => {
        if (userDeletedID !== null) {
          if (miembro.participante.toString() === userDeletedID.id.toString()) {
            grupo.participantes.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      grupo.clasificacion.forEach(async (clasificacion, index) => {
        if (userDeletedID !== null) {
          if (clasificacion.participante.toString() === userDeletedID.id.toString()) {
            grupo.clasificacion.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"}); 
        }

      });
      await grupo.save();
    });

    //? BORRAR DE LA TABLA TRACK LOS USUARIOS QUE PARTICIPAN EN LA RUTA
    const tracks = await Track.find();
    tracks.forEach(async (track) => {
      track.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID.id.toString()) {
            track.usuarios.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });
      await track.save();
    });

    return res.status(200).send(userFoundandDeleted);
  } catch(error) {
    return res.status(400).send(error);    
  }
});

//* Modificar usuario por nombre
userRouter.patch('/', async (req, res) => {
  //! comprobar que se esta añadiendo un nombre
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder actualizarla"});
  }

  const allowedUpdates = ['nombre', 'actividad', 'amigos', 'grupos', 'estadisticas', 'rutas_favoritas', 'historico_rutas'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  //? comprobar si en la base de datos de usuarios existen esos usuarios
  if (req.body.amigos) {
    //iterar sobre el array de amigos
    while (req.body.amigos.length) {
      //sacar el primer elemento del array
      const amigo = req.body.amigos.shift();
      //buscar en la bbdd de usuarios ese id
      const user = await User.findById(amigo);
      //si no existe, devolver error
      if (!user) {
        return res.status(400).send({error: "Alguno de los amigos no existe"});
      }
    }
  }

  //?? Checkeamos si hay grupos de amigos, que todos sus miembros sean usuarios registrados en la bbdd
  if (req.body.grupos) {
    while(req.body.grupos.length) {
      const grupo = req.body.grupos.shift();
      while(grupo.miembros.length) {
        const miembro = grupo.miembros.shift();
        const user = await User.findById(miembro);
        if (!user) {
          return res.status(400).send({error: "Alguno de los miembros del grupo no existe"});
        }
      }
    }
  }

  try {
    const userUpdated = await User.findOneAndUpdate({nombre: req.query.nombre.toString()}, req.body, {new: true, runValidators: true});

    if (userUpdated) {
      return res.status(200).send(userUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});

//* Modifcar usario por ID
userRouter.patch('/:id', async (req, res) => {
  const allowedUpdates = ['nombre', 'actividad', 'amigos', 'grupos', 'estadisticas', 'rutas_favoritas', 'historico_rutas'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  //? comprobar si en la base de datos de usuarios existen esos usuarios
  if (req.body.amigos) {
    //iterar sobre el array de amigos
    while (req.body.amigos.length) {
      //sacar el primer elemento del array
      const amigo = req.body.amigos.shift();
      //buscar en la bbdd de usuarios ese id
      const user = await User.findById(amigo);
      //si no existe, devolver error
      if (!user) {
        return res.status(400).send({error: "Alguno de los amigos no existe"});
      }
    }
  }

  //?? Checkeamos si hay grupos de amigos, que todos sus miembros sean usuarios registrados en la bbdd
  if (req.body.grupos) {
    while(req.body.grupos.length) {
      const grupo = req.body.grupos.shift();
      while(grupo.miembros.length) {
        const miembro = grupo.miembros.shift();
        const user = await User.findById(miembro);
        if (!user) {
          return res.status(400).send({error: "Alguno de los miembros del grupo no existe"});
        }
      }
    }
  }

  try {
    const userUpdated = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if (userUpdated) {
      return res.status(200).send(userUpdated);
    }

    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error); 
  }
});