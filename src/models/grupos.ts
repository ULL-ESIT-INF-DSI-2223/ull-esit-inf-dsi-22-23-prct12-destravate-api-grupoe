import { Document, model, Schema } from 'mongoose';
import { UserDocumentInterface } from './user.js';	
import { TrackDocumentInterface } from './track.js';

//import validator from 'validator';


interface GroupDocumentInterface extends Document {
  nombre: string;
  participantes: {
    participante: UserDocumentInterface;
    fecha: string;
  }[];
  estadisticasGrupales: string; // se calcula con funcion
  clasificacion: {
    participante: UserDocumentInterface;
    fecha: string;
  }[]; // se calcula con funcion
  rutas_favoritas: {// se calcula con funcion
    ruta: string;
    numero_veces: number;
  }[];
  historico_rutas: {
    fecha: string;
    rutas: TrackDocumentInterface[];
  }[]; 
}

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

export const Grupo = model<GroupDocumentInterface>('Grupo', GrupoSchema)