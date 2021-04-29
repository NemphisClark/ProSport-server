const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const {
  create,
  read,
  remove,
  list,
  getParentSubs,
} = require("../controllers/category");

// routes
router.post("/create", authCheck, adminCheck, create);
router.get("/categories", list);
router.get("/:slug", read);
router.delete("/remove/:slug", authCheck, adminCheck, remove);
router.get("/parent-subs/:_id", getParentSubs);

module.exports = router;
