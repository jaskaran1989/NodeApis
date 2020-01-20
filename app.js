const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require('morgan');

const inventoryroutes = require('./routes/inventory');
const orderroutes = require('./routes/orders');

mongoose.connect(
    "mongodb+srv://testuser:<passwordgoeshere>@inventory-order-cvdpt.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
    );
  



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handeling Cross origin
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });


//routes for our api
app.use('/inventories', inventoryroutes);
app.use('/orders', orderroutes);

//handling erorr regarding to routes
app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

  //handeling errors regarding all other error throw by application
  //for example if I say on line 33 error.status(404) then following code will
  //handle any non api related errors
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  

module.exports=app;
