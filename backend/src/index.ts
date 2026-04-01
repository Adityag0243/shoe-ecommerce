import app from './app.js';
import { config } from './config.js';
import connectDB from './infrastructure/db/connect-db.js';

await connectDB();

app.listen(config.port, () => {
     
    console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`,
    );
});
