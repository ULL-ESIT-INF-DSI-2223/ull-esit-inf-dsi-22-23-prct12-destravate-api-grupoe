import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';



describe('Pruebas rutas incorrectas', () => {
  it('Post ruta incorrecta', async () => {
    await request(server).post('/hola').send({
    }).expect(404);
  });
	it('get ruta incorrecta', async () => {
    await request(server).get('/hola').send({
    }).expect(404);
  });
	it('delete ruta incorrecta', async () => {
    await request(server).delete('/hola').send({
    }).expect(404);
  });
	it('patch ruta incorrecta', async () => {
    await request(server).patch('/hola').send({
    }).expect(404);
  });
});
