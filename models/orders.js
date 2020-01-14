const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    Email:{ type:String,required: true },
    Datestamp:Date,
    Status:String
});

module.exports = mongoose.model('Order', orderSchema);