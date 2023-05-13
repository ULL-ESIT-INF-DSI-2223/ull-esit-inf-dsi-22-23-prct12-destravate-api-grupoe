import { Document, model, Schema } from 'mongoose';
import { UserDocumentInterface } from './user.js';


/**
 * @Description Interfaz que extiende Document para el desarrollo del modelo Reto
 */
export interface TrackDocumentInterface extends Document {
  nombre: string;
  coordenadas_inicio_ruta: string;
  coordenada_fin_ruta: string;
  longitud: number;
  desnivel: number;
  usuarios: UserDocumentInterface[];
  tipo_actividad: 'bicicleta' | 'correr';
  calificacion_media: number;
}

/**
 * @Description Esquema de Grupo
 * @Param nombre
 * @Param coordenadas_inicio_ruta
 * @Param coordenada_fin_ruta
 * @Param longitud
 * @Param desnivel
 * @Param usuarios
 * @Param tipo actividad
 * @Param clasificacion media
 */
const TrackSchema = new Schema<TrackDocumentInterface>({
  nombre: { 
    type: String,
    required: true,
    unique: true,
  },
  coordenadas_inicio_ruta: { 
    type: String, 
    required: true,
    validate: (value:string) => { //"28.629572, -17.840229" -- "51.507222, -0.1275" -- "-33.865143, 151.2099"
      if(!value.match(/^-?\d{1,3}(?:\.\d+)?,\s?-?\d{1,3}(?:\.\d+)?$/)) {
        throw new Error('Coordenadas no válidas, asegurese de que introdujo correctamente los datos');
      }
    }
  },
  coordenada_fin_ruta: { 
    type: String, 
    required: true,
    validate: (value:string) => {
      if(!value.match(/^-?\d{1,3}(?:\.\d+)?,\s?-?\d{1,3}(?:\.\d+)?$/)) {
        throw new Error('Coordenadas no válidas, asegurese de que introdujo correctamente los datos');
      }
    }
  },
  longitud: { 
    type: Number, 
    required: true 
  },
  desnivel: { 
    type: Number, 
    required: true 
  },
  usuarios: { 
    type: [Schema.Types.ObjectId],
    ref: 'User',
    // required: true, 
  },
  tipo_actividad: { 
    type: String, 
    required: true 
  },
  calificacion_media: { 
    type: Number, 
    required: true 
  },
});
   
/**
 * @Description Modelo de Ruta
 */
export const Track = model<TrackDocumentInterface>('Track', TrackSchema);