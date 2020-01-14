const express = require('express');
const router = express.Router();
const Order  = require('../models/orders')
const Inventory  = require('../models/inventory')
const mongoose = require('mongoose');

//getting all orders
router.get("/", (req, res, next) => {
  Order.find()
    .select("inventory Email Status _id")
    .exec()
    .then(invesults => {
      res.status(200).json({
        count: invesults.length,
        orders: invesults.map(invresult => {
          return {
            _id: invresult._id,
            Email: invresult.Email,
            inventory: invresult.inventory,
            Datestamp: invresult.Datestamp,
            Status:invresult.Status,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + invresult._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//posting orders
router.post('/', (req, res, next) => {
  Inventory.findById(req.body.inventoryId)
  .then(inventoryitem => {
   
    if (!inventoryitem) {
      return res.status(404).json({
        message: "Inventory not found"
      });
    }
    const order = new Order({
      _id: new mongoose.Types.ObjectId(),
      inventory: req.body.inventoryId,
      Email: req.body.Email,
      Datestamp: new Date().toISOString(),
      Status:"Order created successfully"
    
    });
    return order.save();
  })
  .then(result => {
    Inventory.findById(result.inventory)
    .exec()
    .then(invresult => {
      if(invresult.Quantity>0)
      {
        Inventory.updateOne({ _id: result.inventory }, { $inc: { Quantity: -1 } })
        .exec()
        .then(result => {
          console.log(result);
          res.status(200).json(result);
        })
        res.status(201).json({
          message: "Order stored",
          createdOrder: {
            _id: result._id,
            Email: result.Email,
          inventory: result.inventory,
          Datestamp: result.Datestamp,
          Status:result.Status
          },
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + result._id
          }
        });
      } 
      else{
        res.status(201).json({
          message: "No More Inventory"
          
        });

      }
    })
  
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

//get orders by id 
router.get("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('inventory')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Deleting order by id
router.delete("/:orderId", (req, res, next) => {
  Order.findById(req.params.orderId)
  .populate('inventory')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }
      else{
        Inventory.updateOne({ _id: order.inventory._id }, { $inc: { Quantity: 1 } })
        .exec()
        .then(result => {
          console.log(result);
          res.status(200).json(result);
        })
      }
    })
  Order.remove({ _id: req.params.orderId })
    .exec()
    .then(result => {
     
      
      res.status(200).json({
        message: 'Order deleted',
        request: {
          type: "POST",
          url: "http://localhost:3000/orders",
          body: { inventoryid: "ID", quantity: "Number" }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

//Updating order by id 
router.put("/:orderId", (req, res, next) => {

  const id = req.params.orderId;
  
  const updateOps = {};
  const custumerror={}
  if (req.body.Email!="")
  {
    console.log("gfhfgh");
  }
  updateOps["Email"]=req.body.Email;

   if(req.body.Status ||req.body.Datestamp )
   {
    custumerror["error"]="Status and Datestamp can't be updated";
    res.status(200).json(custumerror);
   }

  Order.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      custumerror["message"]="Order Updated";
        res.status(200).json(custumerror);
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


module.exports =router;
