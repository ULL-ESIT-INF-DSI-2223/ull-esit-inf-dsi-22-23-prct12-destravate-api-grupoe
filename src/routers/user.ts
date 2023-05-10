import { User } from '../models/user.js';
import { Reto } from '../models/retos.js';
import express from 'express';

export const userRouter = express.Router();

//*Añadir un usuario
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

//* Obtener usuarios por nombre
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

//* obtener Usuarios por id
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

//* Borrar usuario por nombre:

userRouter.delete('/', async (req, res) => { 
  if (!req.query.nombre) {
    return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
  }

  try {

    //? ALMACENAMOS EL ID DEl USUARIO QUE QUEREMOS BORRAR
    const userDeletedID = await User.find({nombre: req.query.nombre.toString()});

    //? BORRAMOS EL USUARIO
    const userDeleted = await User.deleteMany({nombre: req.query.nombre.toString()});
    if (!userDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar el usuario, no existe en la base de datos"});
    }

    //? BORRAMOS LOS RETOS QUE TENGA ESE USUARIO
    const retos = await Reto.find();
    retos.forEach(async (reto) => {
      reto.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID[0]._id.toString()) {
            // borrar el usuario del reto
            reto.usuarios.splice(index,1);
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
        }
      });

    });


  } catch (error) {
    return res.status(400).send(error);
  }


});


// userRouter.delete('/', async (req, res) => { 
//   if (!req.query.nombre) {
//     return res.status(400).send({error: "Se debe añadir un nombre de ruta para poder borrarla"});
//   }

//   try {
//     const userDeleted = await User.deleteMany({nombre: req.query.nombre.toString()});

//     if (!userDeleted.acknowledged) {
//       return res.status(500).send({error: "No se pudo borrar el usuario, no existe en la base de datos"});
//     }

//     return res.status(200).send(userDeleted);
//   } catch (error) {
//     return res.status(400).send(error);
//   }
// });






//* Borrar usuario por ID
userRouter.delete('/:id', async (req, res) => {
  try {
  
    //* FALTA POR HACER
      // return res.status(200).send(tracksDeleted);
    const userFoundandDeleted = await User.findByIdAndDelete(req.params.id);

    if (!userFoundandDeleted) {
      return res.status(400).send({error: "No se encontró el usuario con ese id en la base de datos"});
    }

    return res.status(200).send(userFoundandDeleted);
  } catch(error) {
    return res.status(400).send(error);    
  }
});
// userRouter.delete('/:id', async (req, res) => {
//   try {
//     const userFoundandDeleted = await User.findByIdAndDelete(req.params.id);

//     if (!userFoundandDeleted) {
//       return res.status(400).send({error: "No se encontró el usuario con ese id en la base de datos"});
//     }

//     return res.status(200).send(userFoundandDeleted);
//   } catch(error) {
//     return res.status(400).send(error);    
//   }
// });

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