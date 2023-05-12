// import request from 'supertest';
// import { server } from '../src/routers/app.js';
// import { User } from '../src/models/user.js';
// import { Reto } from '../src/models/retos.js';
// import { Grupo } from '../src/models/grupos.js';
// import { Track } from '../src/models/track.js';


// //! todavía no he metido grupos en la base de datos 336-346, 386-398 --> update
// //! falta en delete por id y por nombre, no tengo retos, grupos... --> delete

// const zeroTrack = {
// 	nombre: "Adrian",
// 	actividad: "Correr",
// 	estadisticas: "5-5,10-10,20-20"
// }
// const zero2Track = {
// 	nombre: "Roberto",
// 	actividad: "Bicicleta",
// 	amigos: ["645e6b2d339107be62d6918a"],
// 	estadisticas: "5-5,10-10,20-20"
// }


// before (async () => {
// 	// guardamos todos los usuarios
// 	const users = await User.find();
// 	users.forEach(async (user) => {
// 		if ((user.nombre !== zeroUser.nombre) && (user.nombre !== zero2User.nombre)) {
// 			await User.deleteOne({nombre: user.nombre});
// 			console.log('borrado');
// 		}
// 	});		
// 	// await new User(zeroUser).save();
// });


// describe('POST /tracks', () => {
  
// });


