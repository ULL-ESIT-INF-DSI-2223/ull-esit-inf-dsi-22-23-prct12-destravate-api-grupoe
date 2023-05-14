import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';


let id1 = 0;
let id2 = 0;
let id_track = 0;
let id_group = 0;
let id_reto = 0;

const firstUser = {
	nombre: "Marco 2",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20",
}


before (async () => {

  const FirstUser = await new User(firstUser).save();
	id1 = FirstUser._id;
  const TrackZero = {
    nombre: "Tenerife Blue Trail 2", 
    coordenadas_inicio_ruta: "-33.865143, 151.2099",
    coordenada_fin_ruta: "-33.865143, 151.2099",
    longitud: 5,
    desnivel: 5,
    usuarios: [id1],
    tipo_actividad: "correr",
    calificacion_media: 7
  };
  const trackZero = await new Track(TrackZero).save();
  id_track = trackZero._id;

  const SecondUser = await new User({
    nombre: "Julio 22",
    actividad: "Correr",
    estadisticas: "5-5,10-10,20-20",
    historico_rutas: [id_track],
    grupos: {
      nombre: "Grupo 1",
      miembros: [id1],
    }
  }).save();

  id2 = SecondUser._id;

  const grupoOne = await new Grupo({
    nombre: "Grupo 11",
    participantes: [
      {
        participante: id1,
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

  id_group = grupoOne._id;



  const retoOne = await new Reto({
    nombre: "Reto 1",
    actividad: "Correr",
    rutas: [id_track],
    kms: 7,
    usuarios: [id1, id2]
  }).save();

  id_reto = retoOne._id;

});

describe('POST /challenges', () => {
  it ('Creación de un nuevo reto', async () => {
    await request(server).post('/challenges').send({
      nombre: "Reto 2",
      actividad: "Correr",
      rutas: [id_track],
      kms: 7,
      usuarios: [id1, id2]
    }).expect(201);
  });

  it ('Creación de un nuevo reto falla por falta de nombre', async () => {
    await request(server).post('/challenges').send({
      actividad: "Correr",
      rutas: [id_track],
      kms: 7,
      usuarios: [id1, id2]
    }).expect(400);
  });

});



describe('GET /challenges', () => {
	it('Obtener un reto existente por nombre', async () => { 
    await request(server).get('/challenges?nombre=Reto 1').send().expect(200);
  });
  it('Obtener un reto inexistente por nombre falla', async () => {
    await request(server).get('/challenges?nombre=Reto 3').send().expect(400);
  });
  it('Obtener un reto existente por id', async () => {
    await request(server).get('/challenges/'+id_reto).send().expect(200);
  });
  it('Obtener un reto inexistente por id falla', async () => {
    await request(server).get('/challenges/1234').send().expect(400);
  });
});

describe('Patch /challenges', () => {
	it('Actualizar reto existente', async () => {
    await request(server).patch('/challenges?nombre=Reto 1').send({
      nombre: "Reto 1",
      actividad: "Correr",
      rutas: [id_track],
    }).expect(200);
  });
  it('Actualizar reto que no existe falla', async () => {
    await request(server).patch('/challenges?nombre=RetoX').send({
      nombre: "Reto 1",
      actividad: "Correr",
      rutas: [id_track],
    }).expect(404);
  });
  it('Actualizar parametro no permitido de reto existente', async () => {
    await request(server).patch('/challenges?nombre=Reto 1').send({
      nombre: "Reto 1",
      kms: 10
    }).expect(400);
  });
  it('Actualizar reto existente por id', async () => {
    await request(server).patch('/challenges/'+id_reto).send({
      nombre: "Reto 1",
      actividad: "Correr",
      rutas: [id_track],
    }).expect(200);
  });
  it('Actualizar reto que no existe por id falla', async () => {
    await request(server).patch('/challenges/645fcba81df183ca21d3c8ff').send({
      nombre: "Reto 1",
      actividad: "Correr",
      rutas: [id_track],
    }).expect(404);
  });
  it('Actualizar parametro no permitido de reto existente por id', async () => {
    await request(server).patch('/challenges/'+id_reto).send({
      nombre: "Reto 1",
      kms: 10
    }).expect(400);
  });
});




describe('Delete /groups', () => {
	it('Borrar group inexistente', async () => {
    // se espera 200 por que la operación se lleva a cabo, pero deletedcount=0
		await request(server).delete('/groups?nombre=Grupo 5').send().expect(200);
	});
  it('Borrar group existente', async () => {
    await request(server).delete('/groups?nombre=Grupo 2').send().expect(200);
  });
  it('Borrar group inexistente por id falla', async () => {
    await request(server).delete('/groups/1234').send().expect(400);
  });
  it('Borrar group existente por id', async () => {
    await request(server).delete('/groups/'+id_group).send().expect(200);
  });

});