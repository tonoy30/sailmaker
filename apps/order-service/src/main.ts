import * as express from 'express';
import { connectWithMongoDB } from 'libs/dbs/mongo';
import { orderRouters } from './app/orders';
import { environment } from './environments/environment';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/orders', orderRouters);

connectWithMongoDB(environment.mongoConnectionString);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to order-service!' });
});

const port = environment.port || 3333;

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});

server.on('error', console.error);
