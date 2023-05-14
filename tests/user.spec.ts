import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';
import { expect } from 'chai';
import { response } from 'express';


let id = 0;
let id2 = 0;
let id3 = 0;
let id_track = 0;
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

before (async () => {

	const fourthUser = await new User({
		nombre: "Isidro", 
		actividad: "Correr", 
		estadisticas: "5-5,10-10,20-20"
	}).save();
	id = fourthUser._id;

	const fourthUser2 = await new User({
		nombre: "Isidoro", 
		actividad: "Correr", 
		estadisticas: "5-5,10-10,20-20"
	}).save();
	id3 = fourthUser2._id;

	const trackZero = await new Track({
    nombre: "Tenerife Ultra Blue Trail 2", 
    coordenadas_inicio_ruta: "-33.865143, 151.2099",
    coordenada_fin_ruta: "-33.865143, 151.2099",
    longitud: 5,
    desnivel: 5,
    usuarios: [id,id3],
    tipo_actividad: "correr",
    calificacion_media: 7
  }).save();
  id_track = trackZero._id;

	const fifthUser = await new User({
		nombre: "Julian 2", 
		// amigos: [id],
		grupos: [
			{
				nombreGrupo: "Grupo 1",
				miembros: [id]
			}
		],
		rutas_favoritas: [id_track],
		actividad: "Correr", 
		estadisticas: "5-5,10-10,20-20",
		historico_rutas: [
			{
				fecha: "2021-05-05",
				rutas: [id_track]
			}
		]
	}).save();
	id2 = fifthUser._id.toString();

	const grupoOne = await new Grupo({
    nombre: "Grupo 35",
    participantes: [
      {
        participante: id3,
        fecha: "2021-05-05"
      },
      {
        participante: id2,
        fecha: "2022-11-09"
      }
    ],
    estadisticasGrupales: "5-5,10-10,20-20",
    rutas_favoritas: [
      {
        ruta: id_track,
        numero_veces: 1
      }
    ],
    historico_rutas: [
      {
        fecha: "2021-05-05",
        rutas: [id_track]
      }
    ]
  }).save();

  const retoOne = await new Reto({
    nombre: "Reto 7",
    actividad: "Correr",
    rutas: [id_track],
    kms: 7,
    usuarios: [id2, id3]
  }).save();

});

// nombre: string;
// actividad: 'Correr' | 'Bicicleta';
// amigos: UserDocumentInterface[];
// grupos: {
// 	nombreGrupo: string;
// 	miembros: UserDocumentInterface[];
// }[];
// estadisticas: string;
// rutas_favoritas: TrackDocumentInterface[];
// //retos_activos: string[];
// historico_rutas: {
// 	fecha: string;
// 	rutas: TrackDocumentInterface[];
// }[];


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
			amigos: [id3],
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
		const response = await request(server).get('/users/' + id).send().expect(200);
		expect(response.body).to.include({nombre: "Isidro"});
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

	it('Actualizar usuario existente con id', async () => {
		await request(server).patch('/users/' + id).send({
			nombre: "Isidro",
			actividad: "Correr",
			estadisticas: "5-5,10-10,20-20"
		}).expect(200);
	});

	it('Actualizar usuario con todos los parámetros', async () => {
		await request(server).patch('/users/' + id2).send({
			nombre: "Julian 2", 
			amigos: [id],
			grupos: [
				{
					nombreGrupo: "Grupo 1",
					miembros: [id]
				}
			],
			rutas_favoritas: [id_track],
			actividad: "Correr", 
			estadisticas: "5-5,10-10,20-20",
			historico_rutas: [
				{
					fecha: "2021-05-05",
					rutas: [id_track]
				}
			]
		}).expect(200);
	});
		
});


describe('Delete /users', () => {
	// it('Borrar usuario existente', async () => {
	// 	await request(server).delete('/users?nombre=Nestor').send().expect(200);
	// });
	// it('Borrar usuario existente', async () => {
	// 	await request(server).delete('/users?nombre=Isidoro').send().expect(200);
	// });

	it('Borrar usuario inexistente', async () => {
		// usuario no existe, devuelve 200 por que deletedcount=0
		await request(server).delete('/users?nombre=Fernando').send().expect(400);
	});

	
	it('Borrar usuario existente con id', async () => {
		await request(server).delete('/users/'+id).send().expect(200);
	});

	it('Borrar usuario inexistente con id falla', async () => {
		await request(server).delete('/users/1234').send().expect(400);
	});
});



