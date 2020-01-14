const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Inventory  = require('../models/inventory')

//Getting all the inventories
router.get('/', (req, res, next) => {
    Inventory.find()
    .select("_id Name Description Price Quantity")
    .exec()
    .then(invesults => {
      const response = {
        count: invesults.length,
        products: invesults.map(invresult => {
          return {
            _id: invresult._id,
            Name: invresult.Name,
            Description: invresult.Description,
            Price:invresult.Price,
            Quantity:invresult.Quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/inventories/" + invresult._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Posting inventories
router.post('/', (req, res, next) => {
    const inventory = new Inventory({
        _id: new mongoose.Types.ObjectId(),
        Name:req.body.Name,
        Description:req.body.Description,
        Price:req.body.Price,
        Quantity:req.body.Quantity
    })
    inventory.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created inventory successfully",
        createdProduct: {
            Name: result.Name,
            request: {
                type: 'GET',
                url: "http://localhost:3000/inventories/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Get inventories by id
router.get('/:inventoryId', (req, res, next) => {
    const id = req.params.inventoryId;
    Inventory.findById(id)
    .exec()
    .then(invresult => {
      console.log("From database", invresult);
      if (invresult) {
        res.status(200).json(invresult);
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete('/:inventoryId', (req, res, next) => {
    const id = req.params.inventoryId;
    Inventory.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//Updating inventory by id 
router.put("/:inventoryId", (req, res, next) => {
    const id = req.params.inventoryId;
    const updateOps = {};
    console.log(req.body.Name)
    updateOps["Name"]=req.body.Name;
    updateOps["Description"]=req.body.Description;
    updateOps["Quantity"]=req.body.Quantity;
    updateOps["Price"]=req.body.Price;


    Inventory.updateOne({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        console.log(result);
        res.status(200).json(result);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports =router;
