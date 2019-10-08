const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['received', 'inQueue', 'ready', 'failed'],
        default: 'received'
    },
    sandwichId: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model("order", OrderSchema);
module.exports = Order;