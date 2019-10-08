#!/usr/bin/env node
// Process tasks from the work queue
// in our case an order for a sandwich


const amqp      = require('amqplib');
const sendQueue = require('./sendTask');

// 'handle' the order
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


module.exports.getTask = function(rabbitHost, queueName) {

  try {

    amqp.connect(rabbitHost)
    .then((connection) => {

      process.once('SIGINT', () => { 
        connection.close(); 
      });

      return connection.createChannel()
      .then((channel) => {
        var ok = channel.assertQueue(queueName, { durable : true });
        ok = ok.then(() => {
          channel.prefetch(1);
        });
        ok = ok.then(() => {
          channel.consume(queueName, doWork, { noAck : false });
          console.log(new Date(), " [*] Waiting for messages. To exit press CTRL+C");
        });
        return ok;

        function doWork(msg) {
          var body = msg.content.toString('utf-8');
          console.log(" [x] Received '%s'", body);
  
          var orderObj = JSON.parse(body)          
          orderObj['status'] = "ready";
          console.log(" [x] Sending '%s'", orderObj);
  
  
          sleep(8000).then(()=> {
            sendQueue.addTask(rabbitHost, msg.properties.replyTo, orderObj);
            channel.ack(msg);
          });
  
        }

      });

    })
    .catch((connectionError) => {
      module.exports.getTask(rabbitHost, queueName);
    });
    
  } catch (error) {
    module.exports.getTask(rabbitHost, queueName);
  }
}
