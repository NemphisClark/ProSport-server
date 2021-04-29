const express = require("express");
const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

// controller
const { create, read, remove, list } = require("../controllers/subParent");

// routes
router.post("/parent-sub", authCheck, adminCheck, create);
router.get("/parent-subs", list);
router.get("/parent-sub/:slug", read);
router.delete("/parent-sub/:slug", authCheck, adminCheck, remove);

module.exports = router;
