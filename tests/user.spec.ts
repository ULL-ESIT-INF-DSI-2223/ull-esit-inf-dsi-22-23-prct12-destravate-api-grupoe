import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';


//! todavía no he metido grupos en la base de datos 336-346, 386-398 --> update
//! falta en delete por id y por nombre, no tengo retos, grupos... --> delete

// const zeroUser = {
// 	nombre: "Adrian",
// 	actividad: "Correr",
// 	estadisticas: "5-5,10-10,20-20"
// }
// const zero2User = {
// 	nombre: "Roberto",
// 	actividad: "Bicicleta",
// 	estadisticas: "5-5,10-10,20-20"
// }

const firstUser = {
	nombre: "Marco",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}

const secondUser = {
	nombre: "Julio",
	actividad: "Correr",
	amigos: ["1234", "1111"],
	estadisticas: "5-5,10-10,20-20"
}

let id = 0;

before (async () => {
	// guardamos todos los usuarios
	// const users = await User.find();
	// users.forEach(async (user) => {
	// 	if ((user.nombre !== zeroUser.nombre) && (user.nombre !== zero2User.nombre)) {
	// 		await User.deleteOne({nombre: user.nombre});
	// 	}
	// });		
	await User.deleteMany();
	const fourthUser = await new User({nombre: "Isidro", actividad: "Correr", estadisticas: "5-5,10-10,20-20"}).save();
	id = fourthUser._id.toString();
	// await new User(zeroUser).save();
	// await new User(zero2User).save();
});


describe('POST /users', () => {
  it('Creación de un nuevo usuario', async () => {
    await request(server).post('/users').send(firstUser).expect(201);
  });
	// usuario con amigos inexistentes
	it('Creación de un nuevo usuario 3', async () => {
		await request(server).post('/users').send(secondUser).expect(400);
	});
	
	it('Creación de un nuevo usuario con un nombre vacio', async () => {
		await request(server).post('/users').send({nombre: ""}).expect(400);
	});
	// usuario con amigos existentes --> no se puede
	it('Creación de un nuevo usuario 2', async () => {
		const thirdUser = {
			nombre: "Nestor",
			actividad: "Bicicleta",
			amigos: [id],
			estadisticas: "5-5,10-10,20-20"
		}
		await request(server).post('/users').send(thirdUser).expect(201);
	});
});



describe('GET /users', () => {
	it('Obtener usuario existente', async () => {
		await request(server).get('/users?nombre=Marco').send().expect(200);
	});
	it('Obtener usuario inexistente falla', async () => {
		await request(server).get('/users?nombre=Paco').send().expect(400);
	});
	

	it('Obtener usuario existente con id', async () => {
		await request(server).get('/users/' + id).send().expect(200);
	});

	it('Obtener usuario inexistente con id falla', async () => {
		await request(server).get('/users/12345678').send().expect(400);
	});
});

describe('Patch /users', () => {
	it('Actualizar usuario existente falla', async () => {
		await request(server).patch('/users').send({
			nombre: ""
		}).expect(400);
	});

	it('Actualizar usuario existente', async () => {
		await request(server).patch('/users?nombre=Marco').send({
			nombre: "Marco",
			actividad: "Correr",
			amigos: [id],
			estadisticas: "5-5,10-10,20-20"
		}).expect(200);
	});

	// it('Actualizar usuario existente con amigos falsos', async () => {
	// 	await request(server).patch('/users?nombre=Adrian').send({
	// 		nombre: "Adrian",
	// 		actividad: "Correr",
	// 		amigos: ["1234", "1111"],
	// 		estadisticas: "5-5,10-10,20-20"
	// 	}).expect(400);
	// });

	it('Actualizar usuario existente con id', async () => {
		await request(server).patch('/users/' + id).send({
			nombre: "Isidro",
			actividad: "Correr",
			estadisticas: "5-5,10-10,20-20"
		}).expect(200);
	});

	
});




describe('Delete /users', () => {
	it('Borrar usuario existente', async () => {
		await request(server).delete('/users?nombre=Nestor').send().expect(200);
	});
	it('Borrar usuario inexistente', async () => {
		await request(server).delete('/users?nombre=Fernando').send().expect(400);
	});
	
	it('Borrar usuario existente con id', async () => {
		await request(server).delete('/users/'+id).send().expect(200);
	});

	it('Borrar usuario inexistente con id falla', async () => {
		await request(server).delete('/users/1234').send().expect(400);
	});
});

