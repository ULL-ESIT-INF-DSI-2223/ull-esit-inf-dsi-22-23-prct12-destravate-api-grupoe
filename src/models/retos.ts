import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track.js';
import { UserDocumentInterface } from './user.js';


interface RetoDocumentInterface extends Document {
  nombre: string;
  actividad: 'Correr' | 'Bicicleta';
  rutas: TrackDocumentInterface[];
  kms: number; // hacer funcion que calcule los kms de todas las rutas que incluyen el reto
  usuarios: UserDocumentInterface[];
};

const RetoSchema = new Schema({
  nombre: {
    type: String,
    required: true,
  },
  actividad: {
    type: String,
    required: true,
  },
  rutas: {
    type: [Schema.Types.ObjectId],
    ref: 'Track',
    required: true,
  },
  kms: {
    type: Number, // se calcula al postear el reto
    //required: true,
  },
  usuarios: {
    type: [Schema.Types.ObjectId],
    ref: 'User',
    required: true,
  }
});

export const Reto = model<RetoDocumentInterface>('Challenge', RetoSchema);