const express = require("express");
const router = express.Router();
const {
  getServices,
  getServicesbyId,
  getMyServices,
  getServiceReviews,
  createServices,
  editServices,
  removeService,
  updateServiceStatus,
} = require("../controllers/servicesController");

const authorizeRoles = require("../middlewares/roleMiddleware");
const { verifyToken } = require("../middlewares/authMiddleware");

router.get("/", getServices); 
router.get("/mine", verifyToken, authorizeRoles("provider"), getMyServices); 
router.get("/:id", getServicesbyId); 
router.get("/:id/reviews", getServiceReviews); 

router.post("/create", verifyToken, authorizeRoles("provider"), createServices);
router.put("/edit/:id", verifyToken, authorizeRoles("provider"), editServices);
router.delete("/:id", verifyToken, authorizeRoles("provider"), removeService);

router.patch("/:id/status", verifyToken, authorizeRoles("provider"), updateServiceStatus);
router.put("/:id/status", verifyToken, authorizeRoles("provider"), updateServiceStatus);

module.exports = router;