const StockRepository = require("../repositories/stockRepository");
const db = require("../config/db");
const {createTransport} = require("nodemailer");

const stockRepository = new StockRepository(db);

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: '3treecrops2@gmail.com',
        pass: 'txjwjrctbiahfldg'
    }
});

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

exports.approveGasRequest = async (req, res) => {
    const { outletId, requestId, gasAmount, status } = req.body;

    if (!outletId || !requestId || !gasAmount || !status) {
        return res.status(400).json({
            message: "Invalid request data. Please provide outletId, requestId, gasAmount, and status.",
        });
    }

    try {
        // Fetch the gas request details
        const gasRequest = await stockRepository.getGasRequestById(requestId);
        if (!gasRequest) {
            return res.status(404).json({ message: "Gas request not found." });
        }
        const { gasTypeId } = gasRequest;

        // Check if status is "Approved"
        if (status === "Approved") {
            await stockRepository.updateRequestStatus(requestId, "Approved");

            await stockRepository.reduceHeadOfficeStock(gasTypeId, gasAmount);

            const deliveryId = await stockRepository.createDelivery(outletId,requestId, "Scheduled");

            await stockRepository.createDeliveryDetail(deliveryId, gasTypeId, gasAmount);

            // Fetch outlet managers and pending users
            const outletManagers = await stockRepository.getOutletManagers(outletId);
            const pendingUsers = await stockRepository.getPendingUsers(outletId);

            // Send email to outlet managers
            const managerEmails = outletManagers.map((manager) => manager.email);
            if (managerEmails.length > 0) {
                await transporter.sendMail({
                    from: "3treecrops2@gmail.com",
                    to: managerEmails.join(","),
                    subject: "Gas Request Approved",
                    text: `The gas request with ID ${requestId} has been approved and delivery is scheduled. Please make necessary arrangements.`,
                });
            }

            // Send email to users
            const userEmails = pendingUsers.map((user) => user.email);
            if (userEmails.length > 0) {
                await transporter.sendMail({
                    from: "3treecrops2@gmail.com",
                    to: userEmails.join(","),
                    subject: "Gas Request Approved",
                    text: `Your gas request has been approved. Please hand over the empty cylinder and the payment for the requested gas.`,
                });
            }

            res.status(200).json({
                message: "Gas request approved, delivery scheduled, and notifications sent successfully.",
            });
        } else if (status === "Cancelled" || status === "Rejected") {
            // Update the gas request status
            await stockRepository.updateRequestStatus(requestId, status);

            res.status(200).json({ message: `Gas request status updated to '${status}' successfully.` });
        } else {
            return res.status(400).json({ message: "Invalid status. Only 'Approved', 'Cancelled', or 'Rejected' are allowed." });
        }
    } catch (error) {
        console.error("Error approving gas request:", error);
        res.status(500).json({
            message: "Failed to approve gas request.",
            error: error.message,
        });
    }
};

exports.updateGasRequestAndStock = async (req, res) => {
    const { requestId } = req.params;
    const { requestStatus } = req.body;

    if (!requestId || !requestStatus) {
        return res.status(400).json({ message: "Invalid request. Provide requestId and requestStatus." });
    }

    try {
        const gasRequest = await stockRepository.getGasRequestDetailsByRequestId(requestId);
        if (!gasRequest) {
            return res.status(404).json({ message: "Gas request not found." });
        }

        const { outletId, gasTypeId, quantity } = gasRequest;
        console.log("Gas Request Details:", outletId, gasTypeId, quantity);

        // Check if the status is being set to 'Delivered'
        if (requestStatus === "Delivered") {
            await stockRepository.updateRequestStatus(requestId, requestStatus);

              // Update delivery status to 'Delivered'
              await stockRepository.updateDeliveryStatus(requestId, "Delivered");

            // Check if stock exists for the outlet
            let stock = await stockRepository.getStockByOutletId(outletId);
            if (!stock) {
                const stockId = await stockRepository.createStock(outletId);
                stock = { id: stockId };
            }

            // Check if stock detail exists else create new 
            let stockDetail = await stockRepository.getStockDetail(stock.id, gasTypeId);
            if (!stockDetail) {
                await stockRepository.createStockDetail(stock.id, gasTypeId, quantity);
            } else {
                await stockRepository.updateStockDetailQuantity(stock.id, gasTypeId, quantity);
            }

            return res.status(200).json({
                message: "Gas request marked as Delivered and stock updated successfully.",
            });
        } else {
            await stockRepository.updateRequestStatus(requestId, requestStatus);
            return res.status(200).json({
                message: `Gas request status updated to ${requestStatus} successfully.`,
            });
        }
    } catch (error) {
        console.error("Error updating gas request and stock:", error);
        res.status(500).json({
            message: "An error occurred while updating gas request and stock.",
            error: error.message,
        });
    }
};



