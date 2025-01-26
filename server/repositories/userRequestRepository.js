const db = require('../config/db'); 
class UserRequestRepository {
    constructor(db) {
        this.db = db;
    }
    async getOutletGasAvailability(outletId, gasTypeId) {
        const [result] = await db.query(
            `SELECT stock_details.quantity AS stockQuantity
             FROM stock_details
             INNER JOIN stocks ON stock_details.stock_id = stocks.id
             WHERE stocks.outlet_id = ? AND stock_details.gas_type_id = ?`,
            [outletId, gasTypeId]
        );
        return result[0]; 
    }
    

    async getScheduledDelivery(outletId, gasTypeId) {
        const [result] = await db.query(
            `SELECT d.id AS deliveryId, dd.quantity AS deliveryQuantity
             FROM deliveries AS d
             INNER JOIN delivery_details AS dd ON d.id = dd.delivery_id
             WHERE d.outlet_id = ? AND dd.gas_type_id = ? AND d.status = 'Scheduled'`,
            [outletId, gasTypeId]
        );
        return result[0]; 
    }
    async createUserRequest({ userId, outletId, gasTypeId, quantity, token, deliveryDate, pickupPeriodStart, pickupPeriodEnd }) {
        const [result] = await db.query(
            `INSERT INTO user_requests 
             (user_id, outlet_id, gas_type_id, quantity, token, delivery_date, pickup_period_start, pickup_period_end, request_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, outletId, gasTypeId, quantity, token, deliveryDate, pickupPeriodStart, pickupPeriodEnd]
        );
        return result.insertId;
    }
    async getPendingUserRequests(outletId, gasTypeId) {
        try {
            const query = `
                SELECT quantity
                FROM user_requests
                WHERE outlet_id = ? AND gas_type_id = ? AND request_status = 'pending'
            `;

            const [rows] = await this.db.execute(query, [outletId, gasTypeId]);
            return rows; // Each row will have the quantity of a pending request
        } catch (error) {
            console.error("Error fetching pending user requests:", error);
            throw new Error("Unable to fetch pending user requests.");
        }
    }
}

module.exports = UserRequestRepository;
