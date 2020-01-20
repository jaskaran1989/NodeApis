# NodeApis

## Tools Used:
1. Node.js
2. Nodemon (will keep server running)
3. MongoDB atlas
4. Mongoose
5. Express Server
6. Postman (testing tool for API)


## How to run

1. Navigate to directory with package.json file 
2. Type npm install to install required packages
3. Run npm start
4. To run MongoDB with this project you have to create own MondodB databse online, I use MongoDB altlas it gives you online sandbox to run your operations.Use [https://www.mongodb.com/cloud/atlas] I launch a free cluster an then worked on that and add following to app.js

```
mongoose.connect(
    "mongodb+srv://testuser:<passwordgoeshere>@inventory-order-cvdpt.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
    );
```

## Project Structure

### Directories:
1. routes : This directory includes two file containing routes for both orders and inventory handling all calls for GET, PUT, DELETE and POST
2. models: This directory have schema for order and inventory 

### Files:
1. server.js: This file includes simple setup for server running on port 3000
2. app.js: contains reference to handle routes upcoming call and it also contains mongoose setup


# Datbase models for inventory and order

## inventory model

```
const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    Name:  { type:String,required:true},
    Description: {type:String,required:true},
    Price:  {type:Number,required:true,min: 0},
    Quantity:  {type:Number,required:true,min: 0}

});

module.exports = mongoose.model('Inventory', inventorySchema);

```

## order model

```
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
    Email:{ type:String,required: true },
    Datestamp:Date,
    Status:String
});

module.exports = mongoose.model('Order', orderSchema);

```


## Request endpoints 

### inventories api endpoint


1.	GET http://localhost:3000/inventories
2. GET http://localhost:3000/inventories/inventoryId

3. POST http://localhost:3000/inventories

          {
          "Name": "Soda",
          "Description": "Pepsi soda",
          "Price":  "34",
          "Quantity": "2"
          }

4. PUT http://localhost:3000/inventories/inventoryId

        {
        "Name": "Soda",
        "Description": "Pepsi soda new one ",
        "Price":  "34",
        "Quantity": "2"
        }

5. DELETE http://localhost:3000/inventories/inventoryId





### orders api endpoint

1. GET http://localhost:3000/orders
2. GET http://localhost:3000/orders/orderId

3. POST http://localhost:3000/orders

          {
           "inventoryId": <inventoryid goes here>,
           "Email": " test1@abc.com ",
           "Status":  "",
           "Datestamp":""
          }

4. PUT http://localhost:3000/orders/orderid

        {
          "inventoryId": <inventoryid goes here>,
          "Email": "test3@abc.com",
          "Status":  "",
          "Datestamp":""
        }


5. DELETE http://localhost:3000/orders/orderId

