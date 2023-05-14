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

const firstUser = {
	nombre: "Marco 2",
	actividad: "Correr",
	estadisticas: "5-5,10-10,20-20",
}


before (async () => {
  const FirstUser = await new User(firstUser).save();
	id1 = FirstUser._id;
  const TrackZero = {
    nombre: "Tenerife Blue Trail", 
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
    nombre: "Julio 2",
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
    nombre: "Grupo 1",
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
});



describe('POST /groups', () => {
  it ('Creación de un nuevo grupo', async () => {
    await request(server).post('/groups').send({
      nombre: "Grupo 2",
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
    }).expect(201);
  });


  it ('Creación de un nuevo grupo falla, participante no existe', async () => {
    await request(server).post('/groups').send({
      nombre: "Grupo 2",
      participantes: [
        {
          participante: "1234",
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
    }).expect(400);
  });

});



describe('GET /groups', () => {
	it('Obtener un grupo existente', async () => {
		await request(server).get('/groups?nombre=Grupo 2').send().expect(200);
	});
  it('Obtener un grupo inexistente', async () => {
    await request(server).get('/groups?nombre=Grupo 3').send().expect(400);
  });
  it('Obtener un grupo existente por id', async () => {
    await request(server).get('/groups/'+id_group).send().expect(200);
  });
  it('Obtener un grupo inexistente por id falla', async () => {
    await request(server).get('/groups/1234').send().expect(400);
  });  
});

describe('Patch /groups', () => {
	it('Actualizar group existente', async () => {
		await request(server).patch('/groups?nombre=Grupo 2').send({
			estadisticasGrupales: "5-5,10-10,20-20",
		}).expect(200);
	});
  it('Actualizar group inexistente falla', async () => {
    await request(server).patch('/groups?nombre=Grupo Z').send({
      estadisticasGrupales: "5-5,10-10,20-20",
    }).expect(404);
  });
  it('Actualizar group existente por id', async () => {
    await request(server).patch('/groups/'+id_group).send({
      estadisticasGrupales: "5-5,10-10,20-20",
    }).expect(200);
  });
  it('Actualizar group inexistente por id falla', async () => {
    await request(server).patch('/groups/1234').send({
      estadisticasGrupales: "5-5,10-10,20-20",
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