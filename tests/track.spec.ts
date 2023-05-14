import request from 'supertest';
import { server } from '../src/routers/app.js';
import { User } from '../src/models/user.js';
import { Reto } from '../src/models/retos.js';
import { Grupo } from '../src/models/grupos.js';
import { Track } from '../src/models/track.js';


let id1 = 0;
let id_track = 0;

const firstUser = {
	nombre: "Marco",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20",
}


before (async () => {

  const FirstUser = await new User(firstUser).save();
	id1 = FirstUser._id.toString();
  const trackZero = await new Track({
    nombre: "Tenerife Ultra Blue Trail ", 
    coordenadas_inicio_ruta: "-33.865143, 151.2099",
    coordenada_fin_ruta: "-33.865143, 151.2099",
    longitud: 5,
    desnivel: 5,
    usuarios: [id1],
    tipo_actividad: "correr",
    calificacion_media: 7
  }).save();
  id_track = trackZero._id;
  const secondUser = {
    nombre: "Julio",
    actividad: "Correr",
    estadisticas: "5-5,10-10,20-20",
    historico_rutas: [id_track]
  }
  const SecondUser = await new User(secondUser).save();

});


describe('POST /tracks', () => {
  const track1 = {
    nombre: "Transvulcania", 
    coordenadas_inicio_ruta: "28.629572, -17.840229",
    coordenada_fin_ruta: "51.507222, -0.1275",
    longitud: 7,
    desnivel: 9,
    tipo_actividad: "correr",
    calificacion_media: 8
  }
  it('Creación de un nuevo track', async () => {
    await request(server).post('/tracks').send(track1).expect(201);
  });
  it('Creación de un nuevo track falla', async () => {
    await request(server).post('/tracks').send({}).expect(400);
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
    await request(server).get('/tracks/645fcba81df183ca21d3c8ff').send().expect(400);
  });
});

describe('Patch /tracks', () => {
	it('Actualizar track inexistente falla', async () => {
		await request(server).patch('/tracks?nombre=trail1').send({
			nombre: ""
		}).expect(400);
	});

  it('Actualizar track existente', async () => {
    await request(server).patch('/tracks?nombre=Tenerife Blue Trail').send({
     calificacion_media: 9
    }).expect(200);
  });

  it('Actualizar track existente por id', async () => {
    await request(server).patch('/tracks/'+id_track).send({
     calificacion_media: 9.5
    }).expect(200);
  });

  it('Actualizar track inexistente por id falla', async () => {
    await request(server).patch('/tracks/645fcba81df183ca21d3c8ff').send({
     calificacion_media: 9.5
    }).expect(404);
  });
	
});




describe('Delete /tracks', () => {
	it('Borrar track inexistente', async () => {
		await request(server).delete('/tracks?nombre=trail1').send().expect(400);
	});
  it('Borrar track existente', async () => {
    await request(server).delete('/tracks?nombre=Transvulcania').send().expect(200);
  }
  );
  it('Borrar track existente por id', async () => {
    await request(server).delete('/tracks/'+id_track).send().expect(200);
  });
  it('Borrar track inexistente por id falla', async () => {
    await request(server).delete('/tracks/645fcba81df183ca21d3c8ff').send().expect(400);
  });

});




