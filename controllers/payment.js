const User = require("../models/user");
const Cart = require("../models/cart");

exports.createPaymentIntent = async (req, res) => {
  // 1 find user
  const user = await User.findOne({ email: req.user.email }).exec();
  // 2 get user cart total
  const { cartTotal } = await Cart.findOne({
    orderedBy: user._id,
  }).exec();

  let finalAmount = cartTotal;

  res.send({
    cartTotal,
    finalAmount,
    // clientSecret: paymentIntent.client_secret,
    payable: finalAmount,
  });
};
