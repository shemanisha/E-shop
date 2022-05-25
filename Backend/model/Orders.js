const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  orderItems: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orderitems",
      required: true,
    },
  ],
  shippingAddress1: {
    type: String,
    required: true,
  },
  shippingAddress2: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  totalPrice: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  dateOrdered: {
    type: Date,
    default: Date.now,
  },
});
OrderSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

OrderSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("orders", OrderSchema);

// {
//   "orderItems":[
//   {"quantity":0,
//   "product":""},
//   {"quantity":2,
//   "product":"6072d4e83abd910cb7358aac"}
// ],
// "status":"1",
// "shippingAddress1":"Flowers Street",
// "shippingAddress2":"13",
// "city":"Prague",
// "zip":"15541",
// "country":"Czech Republic",
// "phone":"688874451",
// "totalPrice":1240.9,
// "user":"62849f624ad9cec17b517929"
// }
