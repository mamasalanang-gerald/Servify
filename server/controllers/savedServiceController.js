const savedServiceModel = require("../models/helper/savedServicesModel");

const saveService = async (req, res) => {
  try {
    const saved = await savedServiceModel.saveService(
      req.user.id,
      req.params.serviceId,
    );
    res.status(201).json({ message: "Service saved", saved });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving service", error: err.message });
  }
};

const unsaveService = async (req, res) => {
  try {
    await savedServiceModel.unsaveService(req.user.id, req.params.serviceId);
    res.status(200).json({ message: "Service unsaved" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error unsaving service", error: err.message });
  }
};

const getMySaved = async (req, res) => {
  try {
    const saved = await savedServiceModel.getSavedByUser(req.user.id);
    if (!saved) {
      return res.status(404).json({ message: "No saved services found" });
    }
    res.status(200).json(saved);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching saved services", error: err.message });
  }
};

module.exports = { 
    saveService, 
    unsaveService, 
    getMySaved 
};