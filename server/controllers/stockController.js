const StockRepository = require("../repositories/stockRepository");
const db = require("../config/db");

const stockRepository = new StockRepository(db);

exports.requestGasCylinder = async (req, res) => {
    const { outletId, requestStatus = "InProgress", deliveryDate, gasTypeId, quantity } = req.body;

    // Validate the input
    if (!outletId || !deliveryDate || !gasTypeId || !quantity) {
        return res.status(400).json({ message: "Invalid request data. Please provide outletId, deliveryDate, gasTypeId, and quantity." });
    }

    try {
        // Insert into outlet_request table
        const outletRequestId = await stockRepository.createOutletRequest(outletId, requestStatus, deliveryDate);

        // Insert into outlet_request_details table
        await stockRepository.createOutletRequestDetail(outletRequestId, gasTypeId, quantity);

        res.status(201).json({
            message: "Gas cylinder request created successfully.",
            outletRequestId,
        });
    } catch (error) {
        console.error("Error creating gas cylinder request:", error);
        res.status(500).json({
            message: "Failed to create gas cylinder request.",
            error: error.message,
        });
    }
};
// Ensure this method exists and is exported
exports.filterGasRequest = async (req, res) => {
    const { outletId, status } = req.query;
    const { page = 1, limit = 10 } = req.query;

    if (!outletId || !status) {
        return res.status(400).json({ message: "Outlet ID and status are required." });
    }

    try {
        const offset = (page - 1) * limit;

        const { results, totalCount } = await stockRepository.filterGasRequests(outletId, status, offset, parseInt(limit));

        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            currentPage: parseInt(page),
            totalPages,
            totalRequests: totalCount,
            gasRequests: results,
        });
    } catch (error) {
        console.error("Error filtering gas requests:", error);
        res.status(500).json({
            message: "Failed to fetch gas requests.",
            error: error.message,
        });
    }
};
