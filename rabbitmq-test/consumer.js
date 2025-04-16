const amqp = require('amqplib');
const queue = 'log_queue';

async function consumeMessages() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);

  console.log('Oczekiwanie na wiadomości...');
  channel.consume(queue, msg => {
    if (msg !== null) {
      console.log(`Odebrano: ${msg.content.toString()}`);
      channel.ack(msg);
    }
  });
}

consumeMessages().catch(console.error);
