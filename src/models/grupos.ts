import { Document, model, Schema } from 'mongoose';
import { UserDocumentInterface } from './user.js';	
import { TrackDocumentInterface } from './track.js';

//import validator from 'validator';

/**
 * @Description Interfaz que extiende Document para el desarrollo del modelo Grupo
 */
interface GroupDocumentInterface extends Document {
  nombre: string;
  participantes: {
    participante: UserDocumentInterface;
    fecha: string;
  }[];
  estadisticasGrupales: string; 
  clasificacion: {
    participante: UserDocumentInterface;
    fecha: string;
  }[];
  rutas_favoritas: {
    ruta: string;
    numero_veces: number;
  }[];
  historico_rutas: {
    fecha: string;
    rutas: TrackDocumentInterface[];
  }[]; 
}

/**
 * @Description Esquema de Grupo
 * @Param nombre
 * @Param participantes
 * @Param estadisticas
 * @Param clasificacion
 * @Param rutas favoritas
 */
const GrupoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  participantes: {
    type: [{
      participante: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      fecha: String
    }],
  },
  estadisticasGrupales: {
    type: String,
    // required: true,
    validate: (value:string) => {
      if(!value.match(/^(\d+-\d+,)(\d+-\d+,)(\d+-\d+)$/)) {
        throw new Error('Asegurese de insertar bien los datos estadisticos, un ejemplo sería: 5-5,10-10,20-20 kms-desnivel/semanales, km-desnivel/mensuales, kms-desnivel/anuales');
      }
    }
  },
  clasificacion: {
    type: [{
      participante: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      fecha: String
    }],
  },
  rutas_favoritas: {
    type: [{
      ruta: {
        type: Schema.Types.ObjectId,
        ref: 'Track',
      },
      numero_veces: Number
    }],
    // required: true,
  },
});

/**
 * @Description Modelo de Grupo
 */
export const Grupo = model<GroupDocumentInterface>('Grupo', GrupoSchema)