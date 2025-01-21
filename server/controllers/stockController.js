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

        const { gasTypeId, quantity } = gasRequest;

        // Check if status is "Approved"
        if (status === "Approved") {
            await stockRepository.updateRequestStatus(requestId, "Approved");

            await stockRepository.reduceHeadOfficeStock(gasTypeId, gasAmount);

            const outletManagers = await stockRepository.getOutletManagers(outletId);
            const pendingUsers = await stockRepository.getPendingUsers(outletId);

            // Send email to outlet managers
            const managerEmails = outletManagers.map((manager) => manager.email);
            console.log(managerEmails);
            if (managerEmails.length > 0) {
                await transporter.sendMail({
                    from: "3treecrops2@gmail.com",
                    to: managerEmails.join(","),
                    subject: "Gas Request Approved",
                    text: `The gas request with ID ${requestId} has been approved. Please make necessary arrangements for delivery.`,
                });
            }

            // Send email to  users
            const userEmails = pendingUsers.map((user) => user.email);
            if (userEmails.length > 0) {
                await transporter.sendMail({
                    from: "3treecrops2@gmail.com",
                    to: userEmails.join(","),
                    subject: "Gas Request Approved",
                    text: `Your gas request has been approved. Please hand over the empty cylinder and the payment for the requested gas.`,
                });
            }

            res.status(200).json({ message: "Gas request approved and notifications sent successfully." });
        } else if (status === "Cancelled" || status === "Rejected") {
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
//


