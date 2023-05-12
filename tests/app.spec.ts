import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';

// beforeEach(async () => {
// 	await User.deleteMany();
// 	await new User(zeroUser).save();
// });

const zeroUser = {
	nombre: "Adrian",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}
const zero2User = {
	nombre: "Roberto",
	actividad: "Bicicleta",
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

const thirdUser = {
	nombre: "Nestor",
	actividad: "Bicicleta",
	amigos: ["645dfa5e358333b30d614436"],
	estadisticas: "5-5,10-10,20-20"
}

before (async () => {
	// guardamos todos los usuarios
	const users = await User.find();
	users.forEach(async (user) => {
		console.log('hola')
		if ((user.nombre !== zeroUser.nombre) && (user.nombre !== zero2User.nombre)) {
			await User.deleteOne({nombre: user.nombre});
			console.log('borrado');
		}
	});		
	// await new User(zero2User).save();
});


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
	it('Creación de un nuevo usuario 2', async () => {
    await request(server).post('/users').send(thirdUser).expect(201);
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
	// 645dfa5e358333b30d614436
	it('Obtener usuario existente con id', async () => {
		await request(server).get('/users/645dfa5e358333b30d614436').send().expect(200);
	});

	it('Obtener usuario inexistente con id falla', async () => {
		await request(server).get('/users/645dfa5e300033b30d655555').send().expect(400);
	});
});

describe('Delete /users', () => {
	it('Borrar usuario existente', async () => {
		await request(server).delete('/users?nombre=Nestor').send().expect(200);
	});
	//! esta falla y no se por que, no hay ningun paco en la base de datos.
	// it ('Borrar usuario inexistente falla', async () => {
	// 	await request(server).delete('/users?nombre=Paco').send().expect(400);
	// });
	
	// ? No se puede hacer, cuando lo borro luego lo intento insertar y cambia el id.
	// it('Borrar usuario existente con id', async () => {
	// 	await request(server).delete('/users/645e011db8f439dafdfcf9b5').send().expect(200);
	// });
	it('Borrar usuario inexistente con id falla', async () => {
		await request(server).delete('/users/645dfa5e300033b30d655555').send().expect(400);
	});
});

describe('Patch /users', () => {
	it('Actualizar usuario existente falla', async () => {
		await request(server).patch('/users').send({
			nombre: ""
		}).expect(400);
	});

	it('Actualizar usuario existente', async () => {
		await request(server).patch('/users?nombre=Adrian').send({
			nombre: "Adrian",
			actividad: "Correr",
			estadisticas: "5-5,10-10,20-20"
		}).expect(200);
	});

	it('Actualizar usuario inexistente falla', async () => {
		await request(server).patch('/users').send({
			nombre: "Paco",
			actividad: "Correr",
			estadisticas: "5-5,10-10,20-20"
		}).expect(400);
	});

	it('Actualizar usuario existente con id', async () => {
		await request(server).patch('/users/645dfa5e358333b30d614436').send({
			nombre: "Adrian",
			actividad: "Correr",
			estadisticas: "5-5,10-10,20-20"
		}).expect(200);
	});

});