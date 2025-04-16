const amqp = require('amqplib');
const queue = 'log_queue';

async function sendMessage() {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  await channel.assertQueue(queue);

  setInterval(() => {
    const msg = `Log: ${new Date().toISOString()}`;
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`Wysłano: ${msg}`);
  }, 2000);
}

sendMessage().catch(console.error);
