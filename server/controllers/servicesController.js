const { getServices, getServicesbyId, createServices, removeService, editServices } = require('../models/servicesModel');

const getServices = async (req, res) => {
    const services = await getServices();
    if (!services) return res.status(404).json({ message: 'Services not found' });
    res.status(200).json(services);
};

const getServicesbyId = async (req, res) => {
    const service = await getServicesbyId(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service does not exist' });
    res.status(200).json(service);
};

const createServices = async (req, res) => {
    const service = await createServices(req.body);
    res.status(201).json(service);
};

const editServices = async (req, res) => {
    const service = await editServices(req.params.id, req.body);
    if (!service) return res.status(404).json({ message: 'There are no services to edit' });
    res.status(200).json(service);
};

const removeService = async (req, res) => {
    const service = await removeService(req.params.id);
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
