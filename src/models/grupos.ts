import { Document, model, Schema } from 'mongoose';
import { UserDocumentInterface } from './user.js';	
import { TrackDocumentInterface } from './track.js';

import validator from 'validator';


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
    ruta: TrackDocumentInterface;
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
      participante: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      fecha: String,
      // validate: {
      //   validator: (value:string) => {
      //     validator.default.isDate(value);
      //   }
      // }
    }],
    required: true,
    unique: true,
  },
  estadisticasGrupales: {
    type: String,
    required: true,
  },
  clasificacion: {
    type: [{
      participante: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      fecha: String,
      // validate: {
      //   validator: (value:string) => {
      //     validator.default.isDate(value);
      //   }
      // }
    }],
    required: true,
    unique: true,
  },
  rutas_favoritas: {
    type: [{
      ruta: Schema.Types.ObjectId,
      numero_veces: Number,
    }],
    ref: 'Track',
  },
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

export const Grupo = model<GroupDocumentInterface>('Grupo', GrupoSchema);

