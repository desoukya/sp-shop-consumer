require('dotenv').config();
const { Kafka } = require('kafkajs')
const validate = require('../validation/kafka');
const messages = require('../constants/messages');
const shopProcessor = require('../processors/shop');

const kafka = new Kafka({
  clientId: `${process.env.CLIENT_ID}-${process.env.ENV}`,
  brokers: [process.env.KAFKA_BROKERS],
  ssl: true,
  logLevel: 2,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_SASL_USERNAME,
    password: process.env.KAFKA_SASL_PASSWORD
  },
});

const topic = `${process.env.TOPIC_FIFA_TICKET_SALES}-${process.env.ENV}`;
const consumer = kafka.consumer({ groupId: `${process.env.GROUP_ID}-${process.env.ENV}` });

const startKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsedMessage = JSON.parse(message.value);
      // determine which validation schema to use
      const messageType = parsedMessage.meta.action;
      // validate kafka message against schema prior to processing
      const validatePayload = {
        [messages.TICKET_PENDING]: validate.pendingTicketMessage,
        [messages.TICKET_RESERVED]: validate.reservedTicketMessage,
      }[messageType];
      const validationError = validatePayload(parsedMessage);
      if (validationError) {
        return Promise.reject(validationError.message);
      }

      // process message
      const processMessage = {
        [messages.TICKET_PENDING]: shopProcessor.processPendingTicket,
        [messages.TICKET_RESERVED]: shopProcessor.processReservedTicket,
      }[messageType];      
      await processMessage(message);

      // successfully exit
      return Promise.resolve();
    },
  });
};

module.exports = {
  startKafkaConsumer,
};