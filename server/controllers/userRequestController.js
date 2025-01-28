const crypto = require('crypto');
const UserRequestRepository = require("../repositories/userRequestRepository");
const UserRepository = require("../repositories/userRepository");
const db = require("../config/db");
const { createTransport } = require("nodemailer");

const userRequestRepository = new UserRequestRepository(db);
const userRepository = new UserRepository(db);

const transporter = createTransport({
    service: 'gmail',
    auth: {
        user: '3treecrops2@gmail.com',
        pass: 'txjwjrctbiahfldg',
    },
});

exports.requestGas = async (req, res) => {
    const { userId, outletId, gasTypeId, quantity } = req.body;

    if (!userId || !outletId || !gasTypeId || !quantity) {
        return res.status(400).json({ message: "Invalid request. Provide userId, outletId, gasTypeId, and quantity." });
    }

    try {
        const user = await userRepository.getUserById(userId);
        if (!user || !user.email) {
            return res.status(404).json({ message: "User not found or email not available." });
        }
        const email = user.email;

        // Calculate total available gas (outlet stock + scheduled delivery)
        const outletStock = await userRequestRepository.getOutletGasAvailability(outletId, gasTypeId);
        const scheduledDelivery = await userRequestRepository.getScheduledDelivery(outletId, gasTypeId);
        const totalAvailableGas = 
            (outletStock?.stockQuantity || 0) + 
            (scheduledDelivery?.quantity || 0);

        // Check if requested gas is available
        const pendingRequests = await userRequestRepository.getPendingUserRequests(outletId, gasTypeId);
        const totalPendingRequests = pendingRequests.reduce((sum, req) => sum + req.quantity, 0);
        const totalRequestedGas = totalPendingRequests + quantity;

        if (totalAvailableGas < totalRequestedGas) {
            return res.status(400).json({ message: "Not enough gas available. Request denied." });
        }

        // Generate token and calculate delivery/pickup details
        const token = crypto.randomBytes(8).toString('hex');
        const today = new Date();
        const deliveryDate = new Date(today.setDate(today.getDate() + 7));
        const pickupPeriodStart = new Date(deliveryDate);
        const pickupPeriodEnd = new Date(deliveryDate.setDate(deliveryDate.getDate() + 14));

        const requestId = await userRequestRepository.createUserRequest({
            userId,
            outletId,
            gasTypeId,
            quantity,
            token,
            deliveryDate,
            pickupPeriodStart,
            pickupPeriodEnd,
        });

        await transporter.sendMail({
            from: '"Bodo App" <3treecrops2@gmail.com>',
            to: email,
            subject: 'Gas Request Token Confirmation',
            html: `
                <h1>Gas Request Token Confirmation</h1>
                <p>Thank you for your gas request. Here are your token details:</p>
                <ul>
                    <li><strong>Token:</strong> ${token}</li>
                    <li><strong>Delivery Date:</strong> ${deliveryDate.toISOString().split('T')[0]}</li>
                    <li><strong>Pickup Period:</strong> ${pickupPeriodStart.toISOString().split('T')[0]} - ${pickupPeriodEnd.toISOString().split('T')[0]}</li>
                </ul>
                <p>Please save this information for future reference.</p>
                <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
            `,
        });

        console.log(`Notification sent to user: Token ${token}, Delivery Date: ${deliveryDate}, Pickup Period: ${pickupPeriodStart} - ${pickupPeriodEnd}`);

        return res.status(201).json({
            message: "Gas request created successfully.",
            requestId,
            token,
            deliveryDate,
            pickupPeriod: {
                start: pickupPeriodStart,
                end: pickupPeriodEnd,
            },
        });
    } catch (error) {
        console.error("Error processing gas request:", error);
        return res.status(500).json({
            message: "An error occurred while processing the gas request.",
            error: error.message,
        });
    }
};
exports.approveRequest = async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required." });
    }

    try {
        // Fetch the user request details
        const userRequest = await userRequestRepository.getUserRequestById(requestId);
        if (!userRequest) {
            return res.status(404).json({ message: "User request not found." });
        }

        if (userRequest.request_status !== 'Pending') {
            return res.status(400).json({ message: "User request is not in a pending state." });
        }

        const { outlet_id, user_id, gas_type_id, quantity } = userRequest;

        // Fetch user details for email
        const user = await userRepository.getUserById(user_id);
        if (!user || !user.email) {
            return res.status(404).json({ message: "User not found or email not available." });
        }
        const email = user.email;
        console.log("User email:", email);

        // Check outlet gas stock
        const outletStock = await userRequestRepository.getOutletStock(outlet_id, gas_type_id);

        if (outletStock >= quantity) {
            // Enough stock: Approve and mark as delivered
            await userRequestRepository.updateUserRequestStatus(requestId, 'Delivered');
            await userRequestRepository.updateOutletStock(outlet_id, gas_type_id, quantity);

            await transporter.sendMail({
                from: '"Bodo App" <3treecrops2@gmail.com>',
                to: email,
                subject: 'Gas Request Approved and Delivered',
                html: `
                    <h1>Your Gas Request Has Been Delivered</h1>
                    <p>Your gas request for ${quantity} units has been successfully delivered.</p>
                    <p>Thank you for using our service!</p>
                    <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
                `,
            });

            return res.status(200).json({ message: "User request approved and delivered successfully." });
        } else {
            // Not enough stock: Notify the user to wait
            await userRequestRepository.updateUserRequestStatus(requestId, 'Approved');

            const notificationMessage = `
                Your gas request has been approved. The outlet is awaiting new stock. 
                You will be notified one day before the stock is dispatched.
            `;
            //await userRequestRepository.createNotification(userId, notificationMessage);

            // Send email notification
            await transporter.sendMail({
                from: '"Bodo App" <3treecrops2@gmail.com>',
                to: email,
                subject: 'Gas Request Approved - Awaiting Stock',
                html: `
                    <h1>Your Gas Request Has Been Approved</h1>
                    <p>Your request for ${quantity} units of gas has been approved. 
                    However, the outlet is currently awaiting new stock.</p>
                    <p>You will receive a notification one day before the stock is dispatched.</p>
                    <p>Thank you for your patience!</p>
                    <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
                `,
            });

            return res.status(200).json({
                message: "User request approved. Awaiting new stock.",
                notification: notificationMessage,
            });
        }
    } catch (error) {
        console.error("Error approving user request:", error);
        return res.status(500).json({
            message: "An error occurred while approving the user request.",
            error: error.message,
        });
    }
};
exports.markAsDelivered = async (req, res) => {
    const { requestId } = req.body;

    if (!requestId) {
        return res.status(400).json({ message: "Request ID is required." });
    }

    try {
        const userRequest = await userRequestRepository.getUserRequestById(requestId);
        if (!userRequest) {
            return res.status(404).json({ message: "User request not found." });
        }

        const { user_id, outlet_id, gas_type_id, quantity, request_status } = userRequest;

        if (request_status !== 'Approved') {
            return res.status(400).json({ message: "Only approved requests can be marked as delivered." });
        }

        const user = await userRepository.getUserById(user_id);
        if (!user || !user.email) {
            return res.status(404).json({ message: "User not found or email not available." });
        }

        const outletStock = await userRequestRepository.getOutletStock(outlet_id, gas_type_id);
        if (outletStock < quantity) {
            return res.status(400).json({ message: "Insufficient stock to mark request as delivered." });
        }

        await userRequestRepository.updateUserRequestStatus(requestId, 'Delivered');
        await userRequestRepository.updateOutletStock(outlet_id, gas_type_id, -quantity);

        await transporter.sendMail({
            from: '"Bodo App" <3treecrops2@gmail.com>',
            to: email,
            subject: 'Gas Request Dilivered',
            html: `
                <h1>Your Gas Request Has Been Delivered</h1>
                <p>Your request for ${quantity} units of gas has been successfully delivered.</p>
                <p>Thank you for using our service!</p>
                <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
            `,
        });

        return res.status(200).json({ message: "Request marked as delivered and stock updated successfully." });
    } catch (error) {
        console.error("Error marking request as delivered:", error);
        return res.status(500).json({
            message: "An error occurred while processing the delivery request.",
            error: error.message,
        });
    }
};


