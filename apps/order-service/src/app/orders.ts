import { Channel } from 'amqplib';
import { Router } from 'express';
import { connectToRabbitMQ } from 'libs/amqp/amqp';
import { ORDER_QUEUE_NAME, PRODUCT_QUEUE_NAME } from 'libs/amqp/queue';
import { createOrder } from 'libs/models/order';
import { environment } from '../environments/environment';

const router = Router();

let channel: Channel;

connectToRabbitMQ(environment.rabbitMqConnectionString, ORDER_QUEUE_NAME)
  .then((res: Channel) => {
    console.log('rabbitmq connected successfully');
    channel = res;
  })
  .then(() => {
    channel.consume(ORDER_QUEUE_NAME, (data) => {
      // order service queue listens to this queue
      const { products } = JSON.parse(data.content.toString());
      const newOrder = createOrder(products);
      channel.ack(data);
      channel.sendToQueue(
        PRODUCT_QUEUE_NAME,
        Buffer.from(JSON.stringify(newOrder))
      );
    });
  });

router.get('/', (req, res) => {
  res.send('orders home page');
});

export { router as orderRouters };
