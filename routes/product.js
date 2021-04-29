const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  listAll,
  remove,
  read,
  list,
  // productsCount,
  searchFilters,
} = require("../controllers/product");

// routes
router.post("/product", authCheck, adminCheck, create);
// router.get('/products/total', productsCount)

router.get("/products/:count", listAll); // products/100
router.get("/product/:slug", read);
router.delete("/product/:slug", authCheck, adminCheck, remove);

router.post("/products", list); // lists products in Best Sellers, New Arrivals

// search
router.post("/search/filters", searchFilters);

module.exports = router;
