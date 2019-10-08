'use strict';

const mongoose = require('mongoose');
const Order    = require('../models/Order');


/**
 * Add an order for an sandwich
 *
 * order Order place an order for a sandwich
 * returns Order
 **/
exports.addOrder = function(order) {
  console.log(order);
  //var toBeParsed = order['order'];
  console.log(order.order.sandwichId);
  //var orderJson = JSON.parse(toBeParsed);
  return new Promise(function(resolve, reject) {

    // getOrderById -> id cannot be less than 1, so
    // trying to add order with id that is smaller than 1
    // is prohibited
    if (order.order.id <= 0)
    {
      reject({status: 400, 
              msg: "Order not created"});
    }

    // Create new Order and add it to database
    var ord = new Order({
      orderId: order.order.id,
      status: 'received',
      sandwichId: order.order.sandwichId
    });

    ord.save().then((doc) => {
      resolve(doc);
    }).catch((err) => {
      reject({status: 400, description: 'Order not created'});
    });

});
}


/**
 * Find an order by its ID
 * IDs must be positive integers
 *
 * orderId Long ID of sandwich that needs to be fetched
 * returns Order
 **/
exports.getOrderById = function(orderId) {

  return new Promise(function(resolve, reject) {
    // orderId cannot be smaller than 1
    if (orderId <= 0) { reject({status: 400, description: 'Invalid ID supplied'}) };

    // Find order from database
    Order.find({orderId : orderId}).then((order) => {
      resolve(order);
    }).catch((err) => {
      reject({status: 404, msg: 'Order Not found'});
    });

  });
}


/**
 * Get a list of all orders. Empty array if no orders are found.
 *
 * returns ArrayOfOrders
 **/
exports.getOrders = function() {
  return new Promise((resolve, reject) => {
    // Find all orders from database
    Order.find().then((orders) => {
      resolve(JSON.stringify(orders));
    }).catch((err) => {
      reject({});
    });

  });
}

/**
 * Update order's status.
 * 
 * 'Private', so cannot be called via http.
 * 
 * Does not return anything.
 */
exports.updateOrderById = function(orderID, status) 
{
    return new Promise((resolve, reject) => {
        Order.updateOne({_id : orderID}, {$set:{status}}).then((order) => {
            resolve();
        }).catch((err) => {
            reject(err);
        });
    });
}


/**
 * Delete order by its ID
 * 
 * This endpoint was added to backend as an additional feature.
 */
exports.deleteOrder = function(orderId)
{
  return new Promise((resolve, reject) => {
    Order.findOneAndRemove({orderId : orderId}).then((order) => {
        resolve();
    }).catch((err) => {
        reject(err);
    });
  });
}

