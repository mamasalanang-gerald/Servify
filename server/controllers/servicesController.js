const { getServices: getAllServicesFromDB, getServicesbyId: getServiceByIdFromDB, createServices: createServiceInDB, removeService: removeServiceFromDB, editServices: editServiceInDB } = require('../models/servicesModel');

const getServices = async (req, res) => {
    try {
        const services = await getAllServicesFromDB();
        if (!services) return res.status(404).json({ message: 'Services not found' });
        res.status(200).json(services);
    } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
};



const getServicesbyId = async (req, res) => {
    try {
    const service = await getServiceByIdFromDB(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service does not exist' });
    res.status(200).json(service);
    
} catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
};


const createServices = async (req, res) => {
    try {

    const provider_id = req.user.id;
    const { category_id, title, description, price, service_type, location } = req.body;

    const service = await createServiceInDB(provider_id, category_id, title, description, price, service_type, location);
    res.status(201).json(service);
    
} catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
};



const editServices = async (req, res) => {
    try {
    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService) return res.status(404).json({ message: 'Service does not exist' });
    
    if(existingService.provider_id !== req.user.id) return res.status(403).json({ message: 'You can only edit your own services' });


    const { title, description, price, service_type, location } = req.body;

    const service = await editServiceInDB(req.params.id, title, description, price, service_type, location);
    if (!service) return res.status(404).json({ message: 'There are no services to edit' });
    res.status(200).json(service);
    
} catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
};



const removeService = async (req, res) => {
    try {

    const existingService = await getServiceByIdFromDB(req.params.id);
    if (!existingService) return res.status(404).json({ message: 'Service does not exist' });
    
    if(existingService.provider_id !== req.user.id) return res.status(403).json({ message: 'You can only delete your own services' });
    
    const service = await removeServiceFromDB(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service does not exist' });
    res.status(200).json(service);
    
} catch (err) {
    res.status(500).json({ message: 'Internal server error' });
}
};

module.exports = {
    getServices,
    getServicesbyId,
    createServices,
    editServices,
    removeService
}
