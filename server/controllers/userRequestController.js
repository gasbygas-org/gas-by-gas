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
