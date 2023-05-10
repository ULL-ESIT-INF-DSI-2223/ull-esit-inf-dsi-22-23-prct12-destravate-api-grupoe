import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';

beforeEach(async () => {
	await User.deleteMany();
	await new User(zeroUser).save();
});

const zeroUser = {
	nombre: "Adrian",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}

const firstUser = {
	nombre: "Marco",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}

const secondUser = {
	nombre: "Julio",
	actividad: "Correr",
	amigos: ["645b6c590ad30e1dc7af2bb2"],
	estadisticas: "5-5,10-10,20-20"
}

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

describe('POST /users', () => {
  it('Creación de un nuevo usuario', async () => {
    await request(server).post('/users').send(firstUser).expect(201);
  });
	// it('Creación de un nuevo usuario con un nombre ya existente', async () => {
	// 	await request(server).post('/users').send(firstUser).expect(400);
	// });
	it('Creación de un nuevo usuario con un nombre vacio', async () => {
		await request(server).post('/users').send({nombre: ""}).expect(400);
	});
	// usuario con amigos inexistentes
	it('Creación de un nuevo usuario', async () => {
    await request(server).post('/users').send(secondUser).expect(400);
  });
	// usuario con amigos existentes --> no se puede
});

describe('GET /users', () => {
	it('Obtener usuario existente', async () => {
		await request(server).get('/users?nombre=Adrian').send().expect(200);
	});
	it('Obtener usuario inexistente falla', async () => {
		await request(server).get('/users?nombre=Paco').send().expect(400);
	});
});