# Práctica 12 - Destravate: API Node/Express

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe?branch=main)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2223_ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe)

[![Tests](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe/actions/workflows/node.js.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2223/ull-esit-inf-dsi-22-23-prct12-destravate-api-grupoe/actions/workflows/node.js.yml)

## Índice
[1.Autores](#autores)  
[2.Introducción](#introducción)   
[3.Enunciado del proyecto](#enunciado-del-proyecto)   
[4.Mongoose](#mongoose)   
[5.Código fuente](#código-fuente)
[6.Relaciones entre tablas](#relaciones-entre-tablas)   
[7.Dificultades](#dificultades)  
[8.Tests](#tests)   
[9.Despliegue](#despliegue)  
[10.Referencias](#referencias) 

### Autores  
 - Eva Martínez Bencomo (alu0101396385@ull.edu.es)  
 - Adrián González Expósito (alu0101404813@ull.edu.es)
 - Marco Antonio Barroso Hormiga (alu0101386560@ull.edu.es)

### Introducción  
En este proyecto, el segundo grupal de la asignatura, se tendrá que implementar un API REST, haciendo uso de Node.js y Express, que permita llevar a cabo operaciones de creación, lectura, modificación y borrado (Create, Read, Update, Delete - CRUD) de un registro de actividades deportivas.  

### Enunciado del proyecto  
*Track*  
En la ruta /tracks del API, se deberá poder crear, leer, actualizar o borrar una ruta (deportiva) a través de los métodos HTTP necesarios Para cada ruta incluida dentro del sistema, se debe almacenar la información siguiente:  
- ID único de la ruta.  
- Nombre de la ruta.  
- Geolocalización del inicio (coordenadas).  
- Geolocalización del final de la ruta (coordenadas).  
- Longitud de la ruta en kilómetros.  
- Desnivel medio de la ruta.  
- Usuarios que han realizado la ruta (IDs).  
- Tipo de actividad: Indicador si la ruta se puede realizar en bicicleta o corriendo.  
- Calificación media de la ruta.  
- La operación de lectura o consulta podrá llevarse a cabo de dos maneras diferentes: o bien utilizando una query string donde se consulte por el nombre de la ruta deportiva, o bien utilizando el identificador único de la ruta como parámetro. Las operaciones de modificación y borrado de una ruta también se podrán llevar a cabo de ambos modos.  

*Usuarios*  
En la ruta /users del API, se deberá poder crear, leer, actualizar o borrar un usuario a través de los métodos HTTP necesarios. Dentro del sistema, necesitamos la siguiente información de los usuarios:  

- ID único del usuario (puede ser un username creado por el usuario en el registro o un valor generado automáticamente por el sistema).  
- Nombre del usuario.  
- Actividades que realiza: Correr o bicicleta.  
- Amigos en la aplicación: Colleción de IDs de usuarios con los que interacciona.  
- Grupos de amigos: Diferentes colecciones de IDs de usuarios con los que suele realizar rutas.  
- Estadísticas de entrenamiento: Cantidad de km y desnivel total acumulados en la semana, mes y año.  
- Rutas favoritas: IDs de las rutas que el usuario ha realizado con mayor frecuencia.  
- Retos activos: IDs de los retos que el usuario está realizando actualmente.  
- Histórico de rutas: Los usuarios deben almacenar el historial de rutas realizadas desde que se registraron en el sistema. La información almacenada en esta estructura de datos deberá contener la información de la fecha y el ID de la ruta realizada. Nótese que un usuario puede realizar más de una ruta al día y está decisión puede afectar al tipo de estructura en el que se almacena la información.  

La operación de lectura o consulta podrá llevarse a cabo de dos maneras diferentes: o bien utilizando una query string donde se consulte por el nombre del usuario, o bien utilizando el identificador único del usuario como parámetro. Las operaciones de modificación y borrado de un usuario también se podrán llevar a cabo de ambos modos.  

*Grupos*  
En la ruta /groups del API, se deberá poder crear, leer, actualizar o borrar una grupo a través de los métodos HTTP necesarios. Un grupo de usuarios engloba la información de los usuarios que se unen para realizar rutas juntos.  

- ID único del grupo.  
- Nombre del grupo.  
- Participantes: IDs de los miembros del grupo.  
- Estadísticas de entrenamiento grupal: Cantidad de km y desnivel total acumulados de manera grupal en la semana, mes y año.  
- Clasificación de los usuarios: Ranking de los usuarios que más entrenamientos han realizado históricamente dentro del grupo, es decir, ordenar los usuarios por la cantidad de km totales o desnivel total que han acumulado.  
- Rutas favoritas del grupo: Rutas que los usuarios del grupo han realizado con mayor frecuencia en sus salidas conjuntas.  
- Histórico de rutas realizadas por el grupo: Información similar que almacenan los usuarios pero en este caso referente a los grupos Nótese que un usuario puede realizar rutas con un grupo y/o de manera individual el mismo día. Es decir, a modo de simplificación, asumimos que todos los usuarios de un grupo realizan la actividad cuando se planifica. Aunque, también pueden realizar otras actividades de manera individual.  
La operación de lectura o consulta podrá llevarse a cabo de dos maneras diferentes: o bien utilizando una query string donde se consulte por el nombre del grupo, o bien utilizando el identificador único del grupo como parámetro. Las operaciones de modificación y borrado de una grupo también se podrán llevar a cabo de ambos modos.

### Mongoose  

En lugar de usar el módulo MongoDB hicimos uso de Mongoose, que es un ODM (Object Data Modeling) para MongoDB y Node.js. Es decir, nos permite validar y preparar nuestros datos antes de que pasen a ser almacenados a la base de datos creada

### Código fuente  

El código fuente del proyecto se encuentra alojado en el directorio *src*. Dentro del mismo encontramos 3 subdirectorios:  
1. *models*: Contiene 4 ficheros, uno por cada modelo de la aplicación (track, user, grupos, retos). En cada uno se encuentra una interfaz, un schema y un modelo.
2. *routers*: En primer lugar, nos encontramos con el fichero *app.ts*, donde se encuentra la parte relacionada con el servidor express y se gestionan las peticiones a nivel general, además de manejar las peticiones incorrectas, como cuando no se especifica una ruta. Cuando se usa una ruta, se hace uso de "server.use" y se salta al fichero correspondiente.  

```ts
  import express from 'express';
  import '../db/mongoose.js';
  import { trackRouter } from './track.js';
  import { userRouter } from './user.js';
  import { retoRouter } from './retos.js';
  import { grupoRouter } from './grupo.js';
  
  export const server = express();
  server.use(express.json()); // para que nos funcione el body

  server.use('/tracks',trackRouter)
  server.use('/users',userRouter)
  server.use('/challenges',retoRouter)
  server.use('/groups',grupoRouter)

  server.post('*', (_, res) => {
  res.status(404).send('404 Not Found');
  });

  server.delete('*', (_, res) => {
  res.status(404).send('404 Not Found');
  });

  server.get('*', (_, res) => {
  res.status(404).send('404 Not Found');
  });

  server.patch('*', (_, res) => {
  res.status(404).send('404 Not Found');
  });

  server.listen(3000, () => {
  console.log('Server running on port 3000');
  });
```
El proyecto es extenso, por lo tanto consideramos que lo más adecuado es explicar que se ha desarrollado para las peticiones en cada uno de los ficheros del directorio _routers_. Para cada uno de los modelos, se ha desarrollado un fichero con el nombre del modelo en plural, donde se encuentran las diferentes peticiones.

Las diferentes peticiones realizadas son: post, delete, update y get. A modo de ejemplo, el post de /users tiene en su interior un bloque try-catch, donde en primer lugar se comprueba que los amigos que se han pasado en el body existen, y en caso de que no sea así, se devuelve un error. Se repite la operación para los grupos. En caso de que todo vaya bien, se crea un nuevo usuario y se guarda en la base de datos, además de devolver un código 201.
```ts
  import { User } from '../models/user.js';
  import { Reto } from '../models/retos.js';
  import { Grupo } from '../models/grupos.js';
  import { Track } from '../models/track.js';
  import express from 'express';

  export const userRouter = express.Router();

  //*Añadir un usuario
  userRouter.post('/', async (req, res) => {
    const newUser = new User(req.body);

    try {
      if (req.body.amigos) {
        while (req.body.amigos.length) {
          const amigo = req.body.amigos.shift();
          const user = await User.findById(amigo);
          if (!user) {
            return res.status(400).send({error: "Alguno de los amigos no existe"});
          }
        }
      }
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
      await newUser.save();
      return res.status(201).send(newUser);
    } catch (error) {
      return res.status(400).send(error);
    }
  });
```

El getter, se ha desarrollado de manera que se puede solicitar un elemento mediante el nombre del mismo en la query de la petición, o pasando el id como parámetro. De manera similar sucede en el borrar y el modificar.

Asimismo, mencionar que en el caso de los usuarios y en rutas, se ha sido muy meticuloso en el borrado ya que como son atributos de los schemas de otras tablas, se gestiona aqui el borrado de un elemento que se encuentre en otra tabla, vease el caso de un usuario que se encuentra en la tabla de amigos de otro usuario, se borre de la misma.

3. *db*: Contiene un fichero relacionado con la conexión a la base de datos.  

```ts
  import { connect } from 'mongoose';

  try {
    await connect(process.env.MONGODB_URL!);
    console.log('Connection to MongoDB server established');
  } catch (error) {
    console.log(error);
  }
```

Se hace uso de _"MONGODB_URL"_ debido a que se esta haciendo uso de una variable de entorno para diferenciar entre la base de datos de desarrollo y la de producción. Tenemos dichas variables alojadas en 2 ficheros config (dev.env y test.env) que se encuentra en el directorio raíz del proyecto.  

A continuación, se muestra el contenido del fichero "dev.env":

```
  PORT=3000
  MONGODB_URL=mongodb://127.0.0.1:27017/app
```

### Relaciones entre tablas.
Esta parte fue la más complicada de implementar, en concreto está relacionada con los delete de las diferentes tablas de la base de datos. Los conflictos que hemos detectado son:  
*Rutas*  --> Si se borra una ruta, entonces:  
  - Se debe borrar dicha ruta de los usuarios, en concreto de las rutas favoritas y del histórico de rutas.
  - Se debe borrar dicha ruta de los grupos, en concreto de las rutas favoritas y del histórico de rutas.
  - Por último, se debe borrar dicha ruta de los retos, en concreto, cualquiera que contenga dicha ruta.  

*Usuarios*  --> Si se borra un usuario, entonces:  
  - Se debe borrar dicho usuario de los grupos, en concreto de los participantes.
  - Se debe borrar dicho usuario de los retos, en concreto del ranking.
  - Se debe borrar de los amigos del resto de usuarios y de los grupos del resto de usuarios.
  - Se debe borrar el usuario de los retos en los que estuviese.

*Grupos*  --> Si se borra un grupo, entonces:  
  - Se debe borrar dicho grupo de los usuarios, en concreto se deberá actualizar los grupos de los usuarios que pertenecían a dicho grupo.


### Tests  
Los tests nos dieron bastantes problemas debido a decisiones de diseño en el inicio del proyecto, en concreto, no utilizamos un identificador propio, el único id con el que cuenta cada elemento es el que le asigna automáticamente MongoDB. Por lo tanto, para todas las relaciones entre tablas para las que se requiere el id, o operaciones como borrar por id o modificar por id, fueron un poco más complicadas de implementar. La solución que encontramos fue la de almacenar en una variable los id que fuesemos necesitando en cada momento, para poder utilizarlos posteriormente. Además de todo esto, tuvimos problemas con los métodos hook, necesarios para añadir borrar toda la base de datos de testeo antes de ejecutar los tests. Los paquetes utilizados son mocha, chai y supertest. Las pruebas se encuentran distribuidas en 5 ficheros, uno por cada fichero de "./src/routers".


### Despliegue  
El despliegue fue relativamente sencillo, tan sólo tuvimos que seguir la guía de los apuntes. A modo de resumen, primero nos creamos una cuenta en MongoDB Atlas, donde creamos un cluster y una base de datos. El siguietne paso fue creanos una cuenta en Cyclic, además de hacerle un fork al repo. Luego descargamos MongoBD Compass para poder conectarnos a la base de datos y poder ver los datos que se iban almacenando. Para probar nuestra API, hicimos uso de la extensión *ThunderClient* de VSCode, donde realizamos las diferentes peticiones y comprobamos que todo funcionaba correctamente. 
La dirección que se nos ha asignado es la siguiente: [Dirección](https://jade-swallow-yoke.cyclic.app/).

### Dificultades
Las mayores dificultades que hemos tenido en el desarrollo de la API han sido en primer lugar, el tema de las relaciones entre tablas, ya que no teníamos muy claro como hacerlo. Ya que eran numerosas relaciones y habia que ser muy meticuloso a la hora de desarrollar el borrado de algún elemento. Nos facilito el hecho de organizar en un papel todas las relaciones y ver que elementos se veían afectados por el borrado de un elemento.

Asimismo hemos tenido dificultades con el tema de los tests, ya que era la primera vez que los hacíamos y no sabíamos muy bien como implementarlos. Hemos hecho uso de la librería "supertest" para realizar los tests de la API.

### Referencias

- [Guion de la practica](https://ull-esit-inf-dsi-2223.github.io/prct12-destravate-api/)

- [Apuntes de la asignatura](https://ull-esit-inf-dsi-2223.github.io/nodejs-theory/)

- [Express](https://expressjs.com/es/)

- [Mongoose](https://mongoosejs.com/)

- [MongoDB](https://www.mongodb.com/)
