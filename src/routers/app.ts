import express from 'express';
import '../db/mongoose.js';
import { trackRouter } from './track.js';
import { userRouter } from './user.js';
import { retoRouter } from './retos.js';
 
export const server = express();
server.use(express.json());

server.use('/tracks',trackRouter)
server.use('/users',userRouter)
server.use('/challenges',retoRouter)

//! MANEJO DE ERRORES
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

//? PUERTO DE ESCUCHA
server.listen(3000, () => {
  console.log('Server running on port 3000');
});