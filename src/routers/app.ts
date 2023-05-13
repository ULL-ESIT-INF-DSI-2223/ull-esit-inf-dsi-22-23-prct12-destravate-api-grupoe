import express from 'express';
import '../db/mongoose.js';
import { trackRouter } from './track.js';
import { userRouter } from './user.js';
import { retoRouter } from './retos.js';
import { grupoRouter } from './grupo.js';
 
/**
 * @Description variable para cargar el servidor express
 */
export const server = express();
server.use(express.json()); 

server.use('/tracks',trackRouter)
server.use('/users',userRouter)
server.use('/challenges',retoRouter)
server.use('/groups',grupoRouter)

//! MANEJO DE ERRORES

/**
 * @Description Error 404 para rutas no definidas al hacer un post
 */
server.post('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

/**
 * @Description Error 404 para rutas no definidas al hacer un delete
 */
server.delete('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

/**
 * @Description Error 404 para rutas no definidas al hacer un get
 */
server.get('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

/**
 * @Description Error 404 para rutas no definidas al hacer un patch
 */
server.patch('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

//? PUERTO DE ESCUCHA

/**
 * @Description Puerto de escucha del servidor express
 */
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});