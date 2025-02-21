const db = require('../config/db');
class UserRequestRepository {
    constructor(db) {
        this.db = db;
    }

    // Get outlet gas availability
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

    // Get scheduled delivery for a specific outlet and gas type
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

    // Create a user request
    async createUserRequest({ userId, outletId, gasTypeId, quantity, token, deliveryDate, pickupPeriodStart, pickupPeriodEnd }) {
        const [result] = await db.query(
            `INSERT INTO user_requests 
             (user_id, outlet_id, gas_type_id, quantity, token, delivery_date, pickup_period_start, pickup_period_end, request_status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, outletId, gasTypeId, quantity, token, deliveryDate, pickupPeriodStart, pickupPeriodEnd]
        );
        return result.insertId;
    }

    // Get pending user requests for a specific outlet and gas type
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

    // Get user request by ID
    async getUserRequestById(requestId) {
        const query = `
            SELECT outlet_id, user_id, gas_type_id, quantity, request_status, token, delivery_date, pickup_period_start, pickup_period_end
            FROM user_requests
            WHERE id = ?
        `;
        const [rows] = await db.execute(query, [requestId]);
        return rows[0] || null;
    }

    // Get outlet stock for a specific gas type
    async getOutletStock(outletId, gasTypeId) {
        const query = `
        SELECT sd.quantity
        FROM stocks s
        INNER JOIN stock_details sd ON s.id = sd.stock_id
        WHERE s.outlet_id = ? AND sd.gas_type_id = ?
    `;
        const [rows] = await db.execute(query, [outletId, gasTypeId]);
        return rows[0]?.quantity || 0;
    }

    // Update user request status
    async updateUserRequestStatus(requestId, status) {
        const query = `
            UPDATE user_requests
            SET request_status = ?
            WHERE id = ?
        `;
        await db.execute(query, [status, requestId]);
    }

    // Update user request status
    async updateUserRequestAllocation(requestId, newUserId) {
        const query = `
            UPDATE user_requests
            SET user_id = ?
            WHERE id = ?
        `;
        await db.execute(query, [newUserId, requestId]);
    }

    // Update outlet stock by reducing the quantity
    async updateOutletStock(outletId, gasTypeId, quantity) {
        const query = `
        UPDATE stock_details sd
        INNER JOIN stocks s ON s.id = sd.stock_id
        SET sd.quantity = sd.quantity - ?
        WHERE s.outlet_id = ? AND sd.gas_type_id = ?
    `;
        await db.execute(query, [quantity, outletId, gasTypeId]);
    }

    // Create a notification for the user
    async createNotification(userId, message) {
        const query = `
            INSERT INTO Notifications (userId, message, timestamp)
            VALUES (?, ?, NOW())
        `;
        await db.execute(query, [userId, message]);
    }
     // Method to get gas request count by user ID
     async getGasRequestCountByUserId(userId) {
        try {
            const query = 'SELECT COUNT(*) AS request_count FROM user_requests WHERE user_id = ?';
            const [rows] = await this.db.execute(query, [userId]); // Using prepared statements to prevent SQL injection
            return rows[0].request_count;
        } catch (error) {
            throw new Error('Error retrieving gas request count');
        }
    }
}

module.exports = UserRequestRepository;
