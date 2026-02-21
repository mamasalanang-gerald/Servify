const { getServices: getAllServicesFromDB, getServicesbyId: getServiceByIdFromDB, createServices: createServiceInDB, removeService: removeServiceFromDB, editServices: editServiceInDB } = require('../models/servicesModel');

const getServices = async (req, res) => {
    const services = await getAllServicesFromDB();
    if (!services) return res.status(404).json({ message: 'Services not found' });
    res.status(200).json(services);
};

const getServicesbyId = async (req, res) => {
    const service = await getServiceByIdFromDB(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service does not exist' });
    res.status(200).json(service);
};

const createServices = async (req, res) => {
    const { provider_id, category_id, title, description, price, service_type, location } = req.body;

    const service = await createServiceInDB(provider_id, category_id, title, description, price, service_type, location);
    res.status(201).json(service);
};

const editServices = async (req, res) => {
    const { title, description, price, service_type, location } = req.body;

    const service = await editServiceInDB(req.params.id, title, description, price, service_type, location);
    if (!service) return res.status(404).json({ message: 'There are no services to edit' });
    res.status(200).json(service);
};

const removeService = async (req, res) => {
    const service = await removeServiceFromDB(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service does not exist' });
    res.status(200).json(service);
}

module.exports = {
    getServices,
    getServicesbyId,
    createServices,
    editServices,
    removeService
}
