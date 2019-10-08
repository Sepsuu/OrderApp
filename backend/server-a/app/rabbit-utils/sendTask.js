// Post a new task to the work queue
// in our case an order for a sandwich

// This module handles new task sending to rabbitmq server
// message to be sent is a new order object, which was created by user
// when data is sent, reply_queue is defined in message properties.

'use strict';

var amqp     = require('amqplib');
var dotenv   = require('dotenv').config();
var Order    = require('../service/OrderService');

const RABBITMQURL = process.env.RABBIT_MQ_URL || 'amqp://localhost:5672';
const TASK_QUEUE  = process.env.TASK_QUEUE    || 'task_queue';
const READY_QUEUE = process.env.READY_QUEUE   || 'ready_queue';

module.exports.addTask = function(order){
  amqp.connect(RABBITMQURL)
  .then(function(c) {
    c.createConfirmChannel()
    .then(function(ch) {
      
      ch.sendToQueue(TASK_QUEUE, 
        new Buffer.from(JSON.stringify(order)), 
      {replyTo: READY_QUEUE},
      function(err, ok) {
        if (err !== null)
        {
          console.warn(new Date(), 'Message nacked!');
          Order.updateOrderById(order._id, 'failed');
        }
        else
        {
          console.log(new Date(), 'Message acked');
          Order.updateOrderById(order._id, 'inQueue');
        }
        
      });
    });
  })
  .catch((err) => this.addTask(order));
}
