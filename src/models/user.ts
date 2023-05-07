import { Document, model, Schema } from 'mongoose';

interface UserDocumentInterface extends Document {
  id_usuario: number;
  nombre: string;
  actividades: 'Correr' | 'Bicicleta';
  amigos: string[];
  grupos: string[];
  estadisticas: string;
  rutas_favoritas: string[];
  retos_activos: string[];
  historico_rutas: string[];
}

const UserSchema = new Schema({
  id_usuario: { 
    type: Number,
    required: true,
    unique: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  actividades: {
    type: String,
    required: true,
  },
  amigos: {
    type: [String],
    // required: true,
  },
  grupos: {
    type: [String],
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
    type: [String],
    // required: true,
  },
  retos_activos: {
    type: [String],
    // required: true,
  },
  historico_rutas: {
    type: [String],
    // required: true,
  },

});

export const User = model<UserDocumentInterface>('User', UserSchema);