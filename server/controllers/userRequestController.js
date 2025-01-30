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

module.exports = {
    requestGas: async (req, res) => {
        try {
            const { outletId, gasTypeId, quantity } = req.body;
            
            // Get MySQL user data from requireProfileComplete middleware
            const user = req.mysqlUser;

            // Validate required fields
            if (!outletId || !gasTypeId || !quantity) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide all required fields"
                });
            }

            if (!user || !user.email) {
                return res.status(404).json({ 
                    success: false,
                    message: "User not found or email not available." 
                });
            }

            // Check stock availability
            const outletStock = await userRequestRepository.getOutletGasAvailability(outletId, gasTypeId);
            const scheduledDelivery = await userRequestRepository.getScheduledDelivery(outletId, gasTypeId);
            const totalAvailableGas = (outletStock?.stockQuantity || 0) + (scheduledDelivery?.quantity || 0);

            // Check pending requests
            const pendingRequests = await userRequestRepository.getPendingUserRequests(outletId, gasTypeId);
            const totalPendingRequests = pendingRequests.reduce((sum, req) => sum + req.quantity, 0);
            const totalRequestedGas = totalPendingRequests + quantity;

            if (totalAvailableGas < totalRequestedGas) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough gas available. Request denied."
                });
            }

            // Set dates
            const today = new Date();
            const deliveryDate = new Date(today);
            deliveryDate.setDate(today.getDate() + 7);
            
            const pickupPeriodStart = new Date(deliveryDate);
            const pickupPeriodEnd = new Date(deliveryDate);
            pickupPeriodEnd.setDate(deliveryDate.getDate() + 14);

            // Generate token
            const token = crypto.randomBytes(4).toString('hex').toUpperCase();

            const query = `
                INSERT INTO user_requests (
                    user_id,
                    outlet_id,
                    gas_type_id,
                    quantity,
                    request_status,
                    token,
                    delivery_date,
                    pickup_period_start,
                    pickup_period_end,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, 'Pending', ?, ?, ?, ?, NOW(), NOW())
            `;

            const [result] = await db.query(query, [
                user.id,  // Using MySQL user ID from requireProfileComplete middleware
                outletId,
                gasTypeId,
                quantity,
                token,
                deliveryDate,
                pickupPeriodStart,
                pickupPeriodEnd
            ]);

            // Send email notification
            await transporter.sendMail({
                from: '"Gas By Gas" <3treecrops2@gmail.com>',
                to: user.email,
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
                `
            });

            res.status(201).json({
                success: true,
                message: 'Gas request created successfully',
                requestId: result.insertId,
                token: token,
                deliveryDate: deliveryDate,
                pickupPeriod: {
                    start: pickupPeriodStart,
                    end: pickupPeriodEnd
                }
            });

        } catch (error) {
            console.error('Error creating gas request:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create gas request',
                error: error.message
            });
        }
    },
    // Keeping the approveRequest method unchanged
    approveRequest: async (req, res) => {
        const { requestId } = req.body;

        if (!requestId) {
            return res.status(400).json({
                success: false,
                message: "Request ID is required."
            });
        }

        try {
            const userRequest = await userRequestRepository.getUserRequestById(requestId);
            if (!userRequest) {
                return res.status(404).json({
                    success: false,
                    message: "User request not found."
                });
            }

            if (userRequest.request_status !== 'Pending') {
                return res.status(400).json({
                    success: false,
                    message: "User request is not in a pending state."
                });
            }

            const { outlet_id, user_id, gas_type_id, quantity } = userRequest;
            const user = await userRepository.getUserById(user_id);

            if (!user || !user.email) {
                return res.status(404).json({
                    success: false,
                    message: "User not found or email not available."
                });
            }

            const outletStock = await userRequestRepository.getOutletStock(outlet_id, gas_type_id);

            if (outletStock >= quantity) {
                await userRequestRepository.updateUserRequestStatus(requestId, 'Delivered');
                await userRequestRepository.updateOutletStock(outlet_id, gas_type_id, quantity);

                await transporter.sendMail({
                    from: '"Gas By Gas" <3treecrops2@gmail.com>',
                    to: user.email,
                    subject: 'Gas Request Approved and Delivered',
                    html: `
                        <h1>Your Gas Request Has Been Delivered</h1>
                        <p>Your gas request for ${quantity} units has been successfully delivered.</p>
                        <p>Thank you for using our service!</p>
                        <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
                    `
                });

                return res.status(200).json({
                    success: true,
                    message: "User request approved and delivered successfully."
                });
            } else {
                await userRequestRepository.updateUserRequestStatus(requestId, 'Approved');

                await transporter.sendMail({
                    from: '"Gas By Gas" <3treecrops2@gmail.com>',
                    to: user.email,
                    subject: 'Gas Request Approved - Awaiting Stock',
                    html: `
                        <h1>Your Gas Request Has Been Approved</h1>
                        <p>Your request for ${quantity} units of gas has been approved. 
                        However, the outlet is currently awaiting new stock.</p>
                        <p>You will receive a notification one day before the stock is dispatched.</p>
                        <p>Thank you for your patience!</p>
                        <p>If you have any questions, contact support at <a href="mailto:3treecrops2@gmail.com">3treecrops2@gmail.com</a>.</p>
                    `
                });

                return res.status(200).json({
                    success: true,
                    message: "User request approved. Awaiting new stock."
                });
            }
        } catch (error) {
            console.error("Error approving user request:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to approve user request",
                error: error.message
            });
        }
    },
};
