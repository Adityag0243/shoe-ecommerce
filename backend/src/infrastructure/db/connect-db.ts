import mongoose from 'mongoose';

import { config } from '../../config.js';
import { DB_NAME } from '../../shared/constants/http-constants.js';

export default async function connectDB() {
     
    console.log('MONGODB_URI from env:', config.mongoUri);
    try {
        const connectionInstance = await mongoose.connect(
            `${config.mongoUri}/${DB_NAME}`,
        );
         
        console.log('MONGODB CONNECTED:', connectionInstance.connection.host);
    } catch (error) {
         
        console.log('MONGODB CONNECTION FAILED: ', error);
        process.exit(1);
    }
}
