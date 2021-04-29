const express = require("express");

const router = express.Router();

// middlewares
const { authCheck } = require("../middlewares/auth");

// controllers
const {
  userCart,
  getUserCart,
  emptyCart,
  getAddress,
  saveAddress,
  saveAddressHome,
  saveAddressApartment,
  saveCard,
  getCard,
  saveEmail,
  getEmail,
  savePhone,
  getPhone,
  saveUserName,
  getUserName,
  saveUserSurname,
  getUserSurname,
  createOrder,
  orders,
  addToWishlist,
  wishlist,
  removeFromWishlist,
  createCashOrder,
} = require("../controllers/user");

// cart's routes
router.post("/cart", authCheck, userCart); // save cart
router.get("/cart", authCheck, getUserCart); // get cart
router.delete("/cart", authCheck, emptyCart); // empty cart
router.post("/address", authCheck, saveAddress);
router.post("/address/home", authCheck, saveAddressHome);
router.post("/address/apartment", authCheck, saveAddressApartment);
router.get("/address", authCheck, getAddress);
router.get("/address/home", authCheck, getAddress);
router.get("/address/apartment", authCheck, getAddress);
router.post("/user-card", authCheck, saveCard);
router.get("/user-cards", authCheck, getCard);
router.post("/save-email", authCheck, saveEmail);
router.get("/get-email", authCheck, getEmail);
router.post("/save-phone", authCheck, savePhone);
router.get("/get-phone", authCheck, getPhone);
router.post("/save-name", authCheck, saveUserName);
router.get("/get-name", authCheck, getUserName);
router.post("/save-surname", authCheck, saveUserSurname);
router.get("/get-surname", authCheck, getUserSurname);

// orders' routes
router.post("/order", authCheck, createOrder); // create order
router.post("/cash-order", authCheck, createCashOrder); // cash on delivery
router.get("/orders", authCheck, orders);

// wishlist's routes
router.post("/wishlist", authCheck, addToWishlist);
router.get("/wishlist", authCheck, wishlist);
router.put("/wishlist/:productId", authCheck, removeFromWishlist);

module.exports = router;
