const OutletRepository = require("../repositories/outletRepository");
const db = require("../config/db");

const outletRepository = new OutletRepository(db); // Create a single instance to reuse in all methods

exports.addOutlet = async (req, res) => {
    const { outlet_name, address, district, phone, manager_id } = req.body;

    try {
        if (!outlet_name || !address || !district || !phone || !manager_id) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        await outletRepository.createOutlet({
            outlet_name,
            address,
            district,
            phone,
            manager_id,
        });

        res.status(201).json({ message: 'Outlet added successfully.' });
    } catch (error) {
        console.error('Error adding outlet:', error);
        res.status(500).json({ message: 'Failed to add outlet.', error: error.message });
    }
};

exports.updateOutlet = async (req, res) => {
    const { id } = req.params;
    const { outlet_name, address, district, phone, manager_id } = req.body;

    try {
        const existingOutlet = await outletRepository.getOutletById(id);
        if (!existingOutlet) {
            return res.status(404).json({ message: 'Outlet not found.' });
        }

        await outletRepository.updateOutlet(id, {
            outlet_name,
            address,
            district,
            phone,
            manager_id,
        });

        res.status(200).json({ message: 'Outlet updated successfully.' });
    } catch (error) {
        console.error('Error updating outlet:', error);
        res.status(500).json({ message: 'Failed to update outlet.', error: error.message });
    }
};

exports.getOutletById = async (req, res) => {
    const { id } = req.params;

    try {
        const outlet = await outletRepository.getOutletById(id);
        if (!outlet) {
            return res.status(404).json({ message: 'Outlet not found.' });
        }

        res.status(200).json(outlet);
    } catch (error) {
        console.error('Error fetching outlet:', error);
        res.status(500).json({ message: 'Failed to fetch outlet.', error: error.message });
    }
};

exports.deleteOutlet = async (req, res) => {
    const { id } = req.params;

    try {
        const existingOutlet = await outletRepository.getOutletById(id);
        if (!existingOutlet) {
            return res.status(404).json({ message: 'Outlet not found.' });
        }

        await outletRepository.deleteOutlet(id);

        res.status(200).json({ message: 'Outlet deleted successfully.' });
    } catch (error) {
        console.error('Error deleting outlet:', error);
        res.status(500).json({ message: 'Failed to delete outlet.', error: error.message });
    }
};

exports.getAllOutlets = async (req, res) => {
    try {
        const outlets = await outletRepository.getAllOutlets();
        res.status(200).json(outlets);
    } catch (error) {
        console.error('Error fetching outlets:', error);
        res.status(500).json({
            message: 'Failed to fetch outlets',
            error: error.message
        });
    }
};
