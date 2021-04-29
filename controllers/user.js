const User = require("../models/user");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");
const unique_id = require("uniqueid");

exports.userCart = async (req, res) => {
  const { cart } = req.body;

  let products = [];

  const user = await User.findOne({ email: req.user.email }).exec();

  // check if cart with logged in user id already exist
  let cartExistByThisUser = await Cart.findOne({ orderedBy: user._id }).exec();

  if (cartExistByThisUser) {
    cartExistByThisUser.remove();
    console.log("removed old cart");
  }

  // console.log(cart);

  for (let i = 0; i < cart.length; i++) {
    let object = {};

    console.log(object);
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    object.sizes = cart[i].sizes;
    // get price for creating total
    let productFromDb = await Product.findById(cart[i]._id)
      .select("price")
      .exec();
    object.price = productFromDb.price;

    products.push(object);
  }

  let cartTotal = 0;
  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }

  let newCart = await new Cart({
    products,
    cartTotal,
    orderedBy: user._id,
  }).save();

  console.log("new cart ----> ", newCart);
  res.json({ ok: true });
};

exports.getUserCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).exec();

  let cart = await Cart.findOne({ orderedBy: user._id })
    .populate("products.product", "_id title price")
    .exec();

  const { products, cartTotal } = cart;
  res.json({ products, cartTotal });
};

exports.emptyCart = async (req, res) => {
  console.log("empty cart");
  const user = await User.findOne({ email: req.user.email }).exec();

  const cart = await Cart.findOneAndRemove({ orderedBy: user._id }).exec();
  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const userAddress = await User.findOneAndUpdate(
    { email: req.user.email },
    { address: req.body.address }
  ).exec();

  res.json({ ok: true });
};

exports.saveAddressHome = async (req, res) => {
  const userAddressHome = await User.findOneAndUpdate(
    { email: req.user.email },
    { addressHome: req.body.addressHome }
  ).exec();

  res.json({ ok: true });
};

exports.saveAddressApartment = async (req, res) => {
  const userAddressApartment = await User.findOneAndUpdate(
    { email: req.user.email },
    { addressApartment: req.body.addressApartment }
  ).exec();

  res.json({ ok: true });
};

exports.getAddress = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.saveCard = async (req, res) => {
  const userCard = await User.findOneAndUpdate(
    { email: req.user.email },
    { userCard: req.body.userCard }
  ).exec();

  res.json({ ok: true });
};

exports.getCard = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.saveEmail = async (req, res) => {
  const cartEmail = await User.findOneAndUpdate(
    { email: req.user.email },
    { cartEmail: req.body.cartEmail }
  ).exec();

  res.json({ ok: true });
};

exports.getEmail = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.savePhone = async (req, res) => {
  const userPhone = await User.findOneAndUpdate(
    { email: req.user.email },
    { phoneNumber: req.body.phoneNumber }
  ).exec();

  res.json({ ok: true });
};

exports.getPhone = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.saveUserName = async (req, res) => {
  const userName = await User.findOneAndUpdate(
    { email: req.user.email },
    { userName: req.body.userName }
  ).exec();

  res.json({ ok: true });
};

exports.getUserName = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.saveUserSurname = async (req, res) => {
  const userSurname = await User.findOneAndUpdate(
    { email: req.user.email },
    { userSurname: req.body.userSurname }
  ).exec();

  res.json({ ok: true });
};

exports.getUserSurname = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error("CURRENT USER SESSION ERROR ->", err);
    res.json(user);
  });
};

exports.createOrder = async (req, res) => {
  const {
    name,
    surname,
    address,
    addressHome,
    addressApartment,
  } = req.body.paymentResponse;

  const user = await User.findOne({ email: req.user.email }).exec();
  const { cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  let { products } = await Cart.findOne({ orderedBy: user._id }).exec();
  let finalAmount = cartTotal;

  let newOrder = await new Order({
    products,
    paymentIntent: {
      amount: finalAmount,
      name,
      surname,
      address,
      addressHome,
      addressApartment,
    },
    orderedBy: user._id,
  }).save();

  // decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};

exports.orders = async (req, res) => {
  let user = await User.findOne({ email: req.user.email }).exec();

  let userOrders = await Order.find({ orderedBy: user._id })
    .populate("products.product")
    .exec();

  res.json(userOrders);
};

// addToWishlist wishlist removeFromWishlist
exports.addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $addToSet: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.wishlist = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishlist")
    .exec();

  res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
  const { productId } = req.params;
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishlist: productId } }
  ).exec();

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { COD } = req.body;
  // if COD is true, create order with status of Cash On Delivery

  if (!COD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email }).exec();

  let userCart = await Cart.findOne({ orderedBy: user._id }).exec();

  let finalAmount = 0;

  let newOrder = await new Order({
    products: userCart.products,
    paymentIntent: {
      id: unique_id(),
      amount: finalAmount,
      currency: "rub",
      status: "Cash On Delivery",
      created: Date.now(),
      payment_method_types: ["cash"],
    },
    orderedBy: user._id,
    orderStatus: "Cash On Delivery",
  }).save();

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);
  res.json({ ok: true });
};
