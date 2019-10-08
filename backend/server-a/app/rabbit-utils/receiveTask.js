// Process tasks from the work queue
// this module subscribes 'ready_queue' where
// processed orders appear.

'use strict';

var amqp     = require('amqplib');
var dotenv   = require('dotenv').config();
var Order    = require('../service/OrderService');

const RABBITMQURL   = process.env.RABBIT_MQ_URL || 'amqp://localhost:5672'
const READY_QUEUE   = process.env.READY_QUEUE    || 'ready_queue';

module.exports.getTaskFromQueue =  function() {
    amqp.connect(RABBITMQURL)
    .then(function(conn) {
    process.once('SIGINT', function() { conn.close(); });
    return conn.createChannel().then(function(ch) {
      var ok = ch.assertQueue(READY_QUEUE, {durable: true});
      ok = ok.then(function() { ch.prefetch(1); });
      ok = ok.then(function() {
        ch.consume(READY_QUEUE, doWork, {noAck: false});
        console.log(" [*] Waiting for messages. To exit press CTRL+C");
      });
      return ok;

      function doWork(order) {
        var body = order.content.toString('utf-8');
        var orderObj = JSON.parse(body);
        console.log(" [x] Received %s", body);
        Order.updateOrderById(orderObj['_id'], orderObj['status'])
        .then(function() {
            console.log('Updating order success!');
        }).catch(function(err) {
            console.log('Something bad happened to order');
        });

        ch.ack(order);
        
      }
    }).catch(console.warn);
  })
  .catch((err) => this.getTaskFromQueue());

}
