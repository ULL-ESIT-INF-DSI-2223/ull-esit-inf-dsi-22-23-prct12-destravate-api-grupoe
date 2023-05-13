import { connect } from 'mongoose';


/**
 *  @Description Conexion con la base de datos.
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await connect(process.env.MONGODB_URL!);
  console.log('Connection to MongoDB server established');
} catch (error) {
  console.log(error);
}