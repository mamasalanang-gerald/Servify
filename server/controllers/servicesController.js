const {
  getServices: getAllServicesFromDB,
  getServicesbyId: getServiceByIdFromDB,
  getServicesByProvider,
  createServices: createServiceInDB,
  removeService: removeServiceFromDB,
  editServices: editServiceInDB,
  updateServiceStatus: updateServiceStatusInDB,
} = require("../models/servicesModel");
const { getReviewsByService } = require("../models/reviewModel");

const MAX_PACKAGES = 4;

const normalizePackagesInput = (packages) => {
  if (packages === undefined || packages === null) {
    return { data: [] };
  }

  if (!Array.isArray(packages)) {
    return { error: "Packages must be an array" };
  }

  if (packages.length > MAX_PACKAGES) {
    return { error: `You can only add up to ${MAX_PACKAGES} packages` };
  }

  const normalized = [];

  for (const pkg of packages) {
    const name = String(pkg?.name || "").trim();
    const description = String(pkg?.description || "").trim();
    const duration = String(pkg?.duration || "").trim();
    const hasPriceValue =
      pkg?.price !== "" && pkg?.price !== null && pkg?.price !== undefined;
    const hasAnyValue = name || description || duration || hasPriceValue;

    if (!hasAnyValue) continue;

    const price = Number(pkg?.price);
    if (!name || !Number.isFinite(price) || price <= 0) {
      return {
        error: "Each package must include a valid name and a positive price",
      };
    }

    normalized.push({ name, price, description, duration });
  }

  if (normalized.length > MAX_PACKAGES) {
    return { error: `You can only add up to ${MAX_PACKAGES} packages` };
  }

  return { data: normalized };
};

const resolveServicePrice = (payloadPrice, packages) => {
  if (packages.length > 0) {
    return Math.min(...packages.map((pkg) => pkg.price));
  }

  const basePrice = Number(payloadPrice);
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return null;
  }

  return basePrice;
};

const normalizeImageUrl = (imageUrl) => {
  if (typeof imageUrl !== "string") return "";
  return imageUrl.trim();
};

const getServices = async (req, res) => {
  try {
    const filters = {
      category_id: req.query.category_id || null,
      category_name: req.query.category_name || null,
      max_price: req.query.max_price || null,
      search: req.query.search || null,
    };
    const services = await getAllServicesFromDB(filters);
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getServicesbyId = async (req, res) => {
  try {
    const service = await getServiceByIdFromDB(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service does not exist" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMyServices = async (req, res) => {
  try {
    const services = await getServicesByProvider(req.user.id);
    res.status(200).json(services);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getServiceReviews = async (req, res) => {
  try {
    const reviews = await getReviewsByService(req.params.id);
    res.status(200).json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const createServices = async (req, res) => {
  try {
    const provider_id = req.user.id;
    const {
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      packages,
      image_url,
    } = req.body;

    const normalizedImageUrl = normalizeImageUrl(image_url);
    if (!normalizedImageUrl) {
      return res.status(400).json({
        message: "Service photo is required",
      });
    }

    const { data: normalizedPackages, error: packageError } =
      normalizePackagesInput(packages);
    if (packageError) {
      return res.status(400).json({ message: packageError });
    }

    const resolvedPrice = resolveServicePrice(price, normalizedPackages);
    if (!resolvedPrice) {
      return res.status(400).json({
        message:
          "A valid base price is required when no package tiers are provided",
      });
    }

    const service = await createServiceInDB(
      provider_id,
      category_id,
      title,
      description,
      resolvedPrice,
      service_type,
      location,
      normalizedPackages,
      normalizedImageUrl,
    );
    res.status(201).json(service);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const editServices = async (req, res) => {
  try {
    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService)
      return res.status(404).json({ message: "Service does not exist" });
    if (existingService.provider_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only edit your own services" });
    const {
      category_id,
      title,
      description,
      price,
      service_type,
      location,
      packages,
      image_url,
    } =
      req.body;

    const normalizedImageUrl = normalizeImageUrl(image_url);
    if (!normalizedImageUrl) {
      return res.status(400).json({
        message: "Service photo is required",
      });
    }

    const { data: normalizedPackages, error: packageError } =
      normalizePackagesInput(packages);
    if (packageError) {
      return res.status(400).json({ message: packageError });
    }

    const resolvedPrice = resolveServicePrice(price, normalizedPackages);
    if (!resolvedPrice) {
      return res.status(400).json({
        message:
          "A valid base price is required when no package tiers are provided",
      });
    }

    const service = await editServiceInDB(
      req.params.id,
      category_id,
      title,
      description,
      resolvedPrice,
      service_type,
      location,
      normalizedPackages,
      normalizedImageUrl,
    );
    if (!service)
      return res.status(404).json({ message: "There are no services to edit" });
    res.status(200).json(service);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const removeService = async (req, res) => {
  try {
    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService)
      return res.status(404).json({ message: "Service does not exist" });
    if (existingService.provider_id !== req.user.id)
      return res
        .status(403)
        .json({ message: "You can only delete your own services" });
    const service = await removeServiceFromDB(req.params.id);
    if (!service)
      return res.status(404).json({ message: "Service does not exist" });
    res.status(200).json(service);
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

const updateServiceStatus = async (req, res) => {
    try{
        const { is_active } = req.body;

        if(typeof is_active !== "boolean"){
            return res.status(400).json({message: "Body is not a boolean"});
        }

        const existingService = await getServiceByIdFromDB(req.params.id);
        if (!existingService) { return res.status(404).json({message: "Service does not exist"}); }

        if(existingService.provider_id !== req.user.id){
            return res.status(403).json({message: "You can only update your own services"});
        }

        const updatedStatus = await updateServiceStatusInDB(req.params.id, is_active);
        return res.status(200).json(updatedStatus);        

    } catch (err){
        res.status(500).json({message: "Internal server error", error: err.message});
    }
};



module.exports = {
  getServices,
  getServicesbyId,
  getMyServices,
  getServiceReviews,
  createServices,
  editServices,
  removeService,
  updateServiceStatus,
};
