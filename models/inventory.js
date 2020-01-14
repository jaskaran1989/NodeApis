const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name:  { type:String,required:true},
    Description: {type:String,required:true},
    Price:  {type:Number,required:true,min: 0},
    Quantity:  {type:Number,required:true,min: 0}

});

module.exports = mongoose.model('Inventory', inventorySchema);