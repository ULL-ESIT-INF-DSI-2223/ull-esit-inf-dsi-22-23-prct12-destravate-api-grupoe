import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track.js';

/**
 * @Description Interfaz que extiende Document para el desarrollo del modelo Usuario
 */
export interface UserDocumentInterface extends Document {
  nombre: string;
  actividad: 'Correr' | 'Bicicleta';
  amigos: UserDocumentInterface[];
  grupos: {
    nombreGrupo: string;
    miembros: UserDocumentInterface[];
  }[];
  estadisticas: string;
  rutas_favoritas: TrackDocumentInterface[];
  //retos_activos: string[];
  historico_rutas: {
    fecha: string;
    rutas: TrackDocumentInterface[];
  }[];
}

/**
 * @Description Esquema de Grupo
 * @Param nombre
 * @Param actividad
 * @Param amigos
 * @Param grupos
 * @Param estadisticas
 * @Param rutas_favoritas
 * @Param historico_rutas
 */
const UserSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  actividad: {
    type: String,
    required: true,
  },
  amigos: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    // required: true,
  },
  grupos: {
    type: [{
      nombreGrupo: String,
      miembros: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
    }]
    // required: true,
  },
  estadisticas: {
    type: String,
    // required: true,
    validate: (value:string) => {
      if(!value.match(/^(\d+-\d+,)(\d+-\d+,)(\d+-\d+)$/)) {
        throw new Error('Asegurese de insertar bien los datos estadisticos, un ejemplo sería: 5-5,10-10,20-20 kms-desnivel/semanales, km-desnivel/mensuales, kms-desnivel/anuales');
      }
    }
  },
  rutas_favoritas: {
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    // required: true,
  },
  //! Hay que esperar a tener el model de challenge listo
  // retos_activos: {
  //   type: [Schema.Types.ObjectId],
  //   // required: true,
  // },
  historico_rutas: {
    type: [{
      fecha: String,
      rutas: [{
        type: Schema.Types.ObjectId,
        ref: 'Track',
      }]
    }],
  },
});

/**
 * @Description Modelo de Usuario
 */
export const User = model<UserDocumentInterface>('User', UserSchema);