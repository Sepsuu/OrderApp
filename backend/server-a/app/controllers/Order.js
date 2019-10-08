/**
 * This controller handles all requests concerning orders
 */

'use strict';

var utils     = require('../utils/writer.js');
var Order     = require('../service/OrderService');
var publisher = require('../rabbit-utils/sendTask');

module.exports.addOrder = function addOrder (req, res, next) {
  var order = req.swagger.params['order'].value;
  Order.addOrder(order)
    .then(function (response) {
      publisher.addTask(response);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getOrderById = function getOrderById (req, res, next) {
  var orderId = req.swagger.params['orderId'].value;
  Order.getOrderById(orderId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getOrders = function getOrders (req, res, next) {
  Order.getOrders()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.deleteOrder = function(req, res, next) {
  var orderId = req.swagger.params['orderId'].value;
  Order.deleteOrder(orderId)
    .then(function (response) {
      console.log(response);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });

};
