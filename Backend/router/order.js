const express = require("express");
const Order = require("../model/Orders");
const OrderItem = require("../model/OrderItem");
const router = express.Router();

//getOrders
router.get("/getOrders", (req, res) => {
  Order.find()
    .then((orders) => {
      return res.status(200).json({
        orders: orders,
        message: "Orders fetched successfully",
        success: true,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        err: err.message,
        success: false,
      });
    });
});

//AddOrder
router.post("/addOrder", async (req, res) => {
  let newOrderItemsIds = Promise.all(
    req.body.orderItems.map(async (orderitem) => {
      let newOrderItem = new OrderItem({
        quantity: orderitem.quantity,
        product: orderitem.product,
      });
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );

  const orderItemsIdsResolved = await newOrderItemsIds;

  const {
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
    user,
  } = req.body;
  const order = new Order({
    orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice,
    user,
  });

  res.send(order);
  //   order
  //     .save()
  //     .then((order) => {
  //       return res.status(201).json({
  //         order: order,
  //         message: "Order created successfully",
  //         success: true,
  //       });
  //     })
  //     .catch((err) => {
  //       return res.status(500).json({
  //         err: err.message,
  //         success: false,
  //       });
  //     });
});

module.exports = router;
