const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    name: String,
    userName: String,
    userSurname: String,
    email: {
      type: String,
      required: true,
      index: true,
    },
    cartEmail: {
      type: String,
    },
    role: {
      type: String,
      default: "customer",
    },
    cart: {
      type: Array,
      default: [],
    },
    userCard: String,
    phoneNumber: String,
    address: String,
    addressHome: String,
    addressApartment: String,
    wishlist: [{ type: ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
