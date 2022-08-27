import { connect } from 'amqplib';
export const connectToRabbitMQ = async (amqpUrl: string, queueName: string) => {
  const connection = await connect(amqpUrl);
  const channel = await connection.createChannel();
  channel.assertQueue(queueName);
  return channel;
};
