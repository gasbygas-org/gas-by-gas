const GasTypeRepository = require("../repositories/gasTypeRepository");
const db = require("../config/db");
const gasTypeRepository = new GasTypeRepository(db);

exports.getGasTypes = async (req, res) => {
    try {
        const category = req.query.gas_category || 'Domestic';
        const gasTypes = await gasTypeRepository.getGasTypesByCategory(category);
        res.status(200).json(gasTypes);
    } catch (error) {
        console.error('Error fetching gas types:', error);
        res.status(500).json({
            message: 'Failed to fetch gas types',
            error: error.message
        });
    }
};

exports.getAllGasTypes = async (req, res) => {
    try {
        const gasTypes = await gasTypeRepository.getAllGasTypes();
        res.status(200).json(gasTypes);
    } catch (error) {
        console.error('Error fetching gas types:', error);
        res.status(500).json({
            message: 'Failed to fetch gas types',
            error: error.message
        });
    }
};
