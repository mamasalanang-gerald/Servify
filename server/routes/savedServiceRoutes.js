const express = require("express");
const router = express.Router();
const {
  saveService,
  unsaveService,
  getMySaved,
} = require("../controllers/savedServiceController");

const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", verifyToken, getMySaved);
router.post("/:serviceId", verifyToken, saveService);
router.delete("/:serviceId", verifyToken, unsaveService);

module.exports = router;