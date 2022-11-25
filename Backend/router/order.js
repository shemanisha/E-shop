const express = require("express");
const Order = require("../model/Orders");
const OrderItem = require("../model/OrderItem");
const Product = require("../model/Product");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51LY5ZSSE5rEN3jY8OBivZC7qUQcYC3kPEog9EF2mhFmPL3Aw2JbMs8BnJx5RR8HBWFNT5Q6bqTKoEzSULZY5Lfd200ps0avTNi"
);

//getOrders
router.get("/getOrders", (req, res) => {
  Order.find()
    .populate("user")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 })
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

//getById
router.get("/:orderid", (req, res) => {
  Order.findById(req.params.orderid)
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .then((order) => {
      return res.status(200).json({
        order: order,
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
  const newOrderItemsIds = Promise.all(
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
  const totalPrices = await Promise.all(
    orderItemsIdsResolved.map(async (orderItemsId) => {
      const orderItem = await OrderItem.findById(orderItemsId).populate(
        "product",
        "price"
      );
      const totalPrice = orderItem.product.price * orderItem.quantity;

      return totalPrice;
    })
  );

  const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

  const {
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    user,
  } = req.body;
  const order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1,
    shippingAddress2,
    city,
    zip,
    country,
    phone,
    status,
    totalPrice: totalPrice,
    user,
  });

  order
    .save()
    .then((order) => {
      return res.status(201).json({
        order: order,
        message: "Order created successfully",
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

router.post("/create-checkout-session", async (req, res) => {
  const orderItems = req.body;
  if (!orderItems) {
    return res.status(400).send("checkout session cannot be created");
  }
  const lineItems = await Promise.all(
    orderItems.map(async (orderItem) => {
      const product = await Product.findById(orderItem.product);
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100,
        },
        quantity: orderItem.quantity,
      };
    })
  );
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:4200/success",
    cancel_url: "http://localhost:4200/error",
  });

  res.json({
    id: session.id,
  });
});

//update order

router.put("/:orderid", (req, res) => {
  const { status } = req.body;
  Order.findByIdAndUpdate(req.params.orderid, {
    status: status,
  })
    .then((updatedOrder) => {
      console.log(updatedOrder);
      if (!updatedOrder) {
        return res.status(404).json({
          message: "Order doesn't exist",
          success: false,
        });
      }
      return res.status(200).json({
        order: updatedOrder,
        message: "Order updated successfully",
        success: true,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

//deleteOrder
router.delete("/:orderid", (req, res) => {
  Order.findByIdAndRemove(req.params.orderid)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async (orderItem) => {
          await OrderItem.findByIdAndRemove(orderItem);
        });
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "order not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

//get Totalsales
router.get("/get/TotalSales", (req, res) => {
  const totalSales = Order.aggregate([
    {
      $group: { _id: null, totalsales: { $sum: "$totalPrice" } },
    },
  ]).then((totalSales) => {
    return res.status(200).send({ totalsales: totalSales.pop().totalsales });
  });
});

//get total count of orders
router.get("/get/count", (req, res) => {
  Order.countDocuments()
    .then((count) => {
      return res.status(200).json({
        orderCount: count,
      });
    })
    .catch((err) => {
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    });
});

//getting orders placed by user
router.get("/get/userorders/:userid", (req, res) => {
  Order.find({ user: req.params.userid })
    .populate({
      path: "orderItems",
      populate: {
        path: "product",
        populate: "category",
      },
    })
    .sort({ dateOrdered: -1 })
    .then((userorders) => {
      return res.status(200).json({
        orders: userorders,
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

module.exports = router;
