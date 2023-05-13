import { Document, model, Schema } from 'mongoose';
import { TrackDocumentInterface } from './track.js';
import { UserDocumentInterface } from './user.js';


/**
 * @Description Interfaz que extiende Document para el desarrollo del modelo Reto
 */
interface RetoDocumentInterface extends Document {
  nombre: string;
  actividad: 'Correr' | 'Bicicleta';
  rutas: TrackDocumentInterface[];
  kms: number; // hacer funcion que calcule los kms de todas las rutas que incluyen el reto
  usuarios: UserDocumentInterface[];
};

/**
 * @Description Esquema de Grupo
 * @Param nombre
 * @Param actividad
 * @Param rutas
 * @Param kms
 * @Param usuarios
 */
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

/**
 * @Description Modelo de Reto
 */
export const Reto = model<RetoDocumentInterface>('Challenge', RetoSchema);