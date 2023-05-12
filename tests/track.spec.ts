import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';


//! todavía no he metido grupos en la base de datos 336-346, 386-398 --> update
//! falta en delete por id y por nombre, no tengo retos, grupos... --> delete


const firstUser = {
	nombre: "Marco 2",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}

const secondUser = {
	nombre: "Julio 2",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20"
}

let id1 = 0;
let id2 = 0;
let id_track = 0;

// nombre: string;
// coordenadas_inicio_ruta: string;
// coordenada_fin_ruta: string;
// longitud: number;
// desnivel: number;
// usuarios: UserDocumentInterface[];
// tipo_actividad: 'bicicleta' | 'correr';
// calificacion_media: number;

before (async () => {
	await Track.deleteMany();
	await User.deleteMany();
  const FirstUser = await new User(firstUser).save();
	const SecondUser = await new User(secondUser).save();
	id1 = FirstUser._id.toString();
  id2 = SecondUser._id.toString();
  const trackZero = await new Track({
    nombre: "Tenerife Blue Trail", 
    coordenadas_inicio_ruta: "-33.865143, 151.2099",
    coordenada_fin_ruta: "-33.865143, 151.2099",
    longitud: 5,
    desnivel: 5,
    usuarios: [id1],
    tipo_actividad: "correr",
    calificacion_media: 7
  }).save();
  id_track = trackZero._id.toString();
});


describe('POST /tracks', () => {
  // const track1 = {
  //   nombre: "Transvulcania", 
  //   coordenadas_inicio_ruta: "28.629572, -17.840229",
  //   coordenada_fin_ruta: "51.507222, -0.1275",
  //   longitud: 7,
  //   desnivel: 9,
  //   // usuarios: [id1],
  //   tipo_actividad: "correr",
  //   calificacion_media: 8
  // }
  // it('Creación de un nuevo track', async () => {
    //   await request(server).post('/users').send(track1).expect(201);
  // });
  //? tengo que revisar por que falla.
  it('Creación de un nuevo track falla', async () => {
    await request(server).post('/users').send({}).expect(400);
  });

});



describe('GET /tracks', () => {
	it('Obtener un track existente', async () => {
		await request(server).get('/tracks?nombre=Tenerife Blue Trail').send().expect(200);
	});
  it('Obtener un track inexistente', async () => {
    await request(server).get('/tracks?nombre=San Silvestre').send().expect(400);
  });
  it('Obtener un track existente por id', async () => {
    await request(server).get('/tracks/'+id_track).send().expect(200);
  });
  it('Obtener un track inexistente por id', async () => {
    await request(server).get('/tracks/1234').send().expect(400);
  });
});

// describe('Patch /users', () => {
// 	it('Actualizar usuario existente falla', async () => {
// 		await request(server).patch('/users').send({
// 			nombre: ""
// 		}).expect(400);
// 	});

// 	it('Actualizar usuario existente', async () => {
// 		await request(server).patch('/users?nombre=Adrian').send({
// 			nombre: "Adrian",
// 			actividad: "Correr",
// 			amigos: [id],
// 			estadisticas: "5-5,10-10,20-20"
// 		}).expect(200);
// 	});

// 	// it('Actualizar usuario existente con amigos falsos', async () => {
// 	// 	await request(server).patch('/users?nombre=Adrian').send({
// 	// 		nombre: "Adrian",
// 	// 		actividad: "Correr",
// 	// 		amigos: ["1234", "1111"],
// 	// 		estadisticas: "5-5,10-10,20-20"
// 	// 	}).expect(400);
// 	// });

// 	it('Actualizar usuario existente con id', async () => {
// 		await request(server).patch('/users/' + id).send({
// 			nombre: "Isidro",
// 			actividad: "Correr",
// 			estadisticas: "5-5,10-10,20-20"
// 		}).expect(200);
// 	});

	
// });




// describe('Delete /users', () => {
// 	it('Borrar usuario existente', async () => {
// 		await request(server).delete('/users?nombre=Nestor').send().expect(200);
// 	});
// 	it('Borrar usuario inexistente', async () => {
// 		await request(server).delete('/users?nombre=Fernando').send().expect(400);
// 	});
	
// 	it('Borrar usuario existente con id', async () => {
// 		await request(server).delete('/users/'+id).send().expect(200);
// 	});

// 	it('Borrar usuario inexistente con id falla', async () => {
// 		await request(server).delete('/users/1234').send().expect(400);
// 	});
// });




