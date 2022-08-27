import { Channel } from 'amqplib';
import { Router } from 'express';
import { connectToRabbitMQ } from 'libs/amqp/amqp';
import { ORDER_QUEUE_NAME, PRODUCT_QUEUE_NAME } from 'libs/amqp/queue';
import { Product } from 'libs/models/product';
import { environment } from '../environments/environment';
const router = Router();

let channel: Channel;

connectToRabbitMQ(
  environment.rabbitMqConnectionString,
  PRODUCT_QUEUE_NAME
).then((res: Channel) => {
  console.log('rabbitmq connected successfully');
  channel = res;
});

router.get('/', (req, res) => {
  res.send('products home page');
});

// create new product
router.post('/', async (req, res) => {
  // validate req body
  const { name, price, description, previewUrl } = req.body;
  if (!name || !price || !description || !previewUrl) {
    return res.status(400).json({
      message: 'Please provide name, price, description and preview image url',
    });
  }
  // create product
  const product = new Product({ ...req.body });
  // save to db
  await product.save();
  // return the success response
  return res.status(201).json({
    message: 'Product created successfully',
    product,
  });
});

// buy a product
router.post('/buy', async (req, res) => {
  const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds } });
  console.log(products);
  // send order to queue
  channel.sendToQueue(
    ORDER_QUEUE_NAME,
    Buffer.from(JSON.stringify({ products }))
  );

  // consume previously placed order from rabbitmq & acknowledge the transaction
  channel.consume(PRODUCT_QUEUE_NAME, (data) => {
    console.log(`Consumed from ${ORDER_QUEUE_NAME}`);
    const order = JSON.parse(data.content.toString());
    console.log(order);
    channel.ack(data);
  });

  // Return a success message
  return res.status(201).json({
    message: 'Order placed successfully',
  });
});

export { router as productRouters };
