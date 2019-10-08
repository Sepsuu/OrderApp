const amqp        = require('amqplib');
const dotenv      = require('dotenv').config();
const recvTask    = require('./rabbit-utils/receiveTask');

const rabbitmqURL    = process.env.RABBIT_MQ_URL;
const consumeQueue   = process.env.TASK_QUEUE;

recvTask.getTask(rabbitmqURL, consumeQueue);
