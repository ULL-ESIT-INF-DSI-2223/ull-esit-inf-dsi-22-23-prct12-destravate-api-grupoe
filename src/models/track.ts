import { Document, model, Schema } from 'mongoose';

interface TrackDocumentInterface extends Document {
  name: string;
  coordenadas_inicio_ruta: string;
  coordenada_fin_ruta: string;
  longitud: number;
  desnivel: number;
  //user: string[]; 
  tipo_actividad: 'bicicleta' | 'correr';
  calificacion_media: number;
}

const TrackSchema = new Schema<TrackDocumentInterface>({
  name: { 
    type: String,
    required: true,
    unique: true
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
    validate: (value:string) => { //x:<n>,y:<n>,z:<n>
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
  //user: { 
  //   type: String, 
  //   required: true 
  // },
  tipo_actividad: { 
    type: String, 
    required: true 
  },
  calificacion_media: { 
    type: Number, 
    required: true 
  },
});
    
export const Track = model<TrackDocumentInterface>('Track', TrackSchema);