import express from 'express';
import './server.js';
import { trackRouter } from './track.js'

export const server = express();
server.use(express.json());

server.use('/tracks',trackRouter)

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