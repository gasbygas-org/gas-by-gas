const db = require('../config/db'); 

class UserRequestRepository {
    constructor(db) {
        this.db = db;
    }

    // Get requests with different filters
    async getAllRequests() {
        try {
            const query = `
                SELECT 
                    ur.*,
                    u.name as user_name,
                    u.email as user_email,
                    gt.gas_type_name,
                    o.outlet_name
                FROM user_requests ur
                JOIN users u ON ur.user_id = u.id
                JOIN gas_types gt ON ur.gas_type_id = gt.id
                JOIN outlets o ON ur.outlet_id = o.id
                ORDER BY ur.created_at DESC
            `;
            
            const [requests] = await this.db.query(query);
            return requests;
        } catch (error) {
            console.error('Error fetching all requests:', error);
            throw error;
        }
    }

    async getUserRequests(userId) {
        try {
            const query = `
                SELECT 
                    ur.*,
                    gt.gas_type_name,
                    o.outlet_name
                FROM user_requests ur
                JOIN gas_types gt ON ur.gas_type_id = gt.id
                JOIN outlets o ON ur.outlet_id = o.id
                WHERE ur.user_id = ?
                ORDER BY ur.created_at DESC
            `;
            const [requests] = await this.db.query(query, [userId]);
            return requests;
        } catch (error) {
            console.error('Error fetching user requests:', error);
            throw error;
        }
    }

    async getUserRequestById(requestId) {
        try {
            const query = `
                SELECT 
                    ur.*,
                    u.name as user_name,
                    u.email as user_email,
                    gt.gas_type_name,
                    o.outlet_name
                FROM user_requests ur
                JOIN users u ON ur.user_id = u.id
                JOIN gas_types gt ON ur.gas_type_id = gt.id
                JOIN outlets o ON ur.outlet_id = o.id
                WHERE ur.id = ?
            `;
            const [rows] = await this.db.query(query, [requestId]);
            return rows[0];
        } catch (error) {
            console.error('Error fetching request by ID:', error);
            throw error;
        }
    }

    // Stock related methods
    async getOutletGasAvailability(outletId, gasTypeId) {
        try {
            const query = `
                SELECT sd.quantity as stockQuantity
                FROM stocks s
                JOIN stock_details sd ON s.id = sd.stock_id
                WHERE s.outlet_id = ? AND sd.gas_type_id = ?
            `;
            const [result] = await this.db.query(query, [outletId, gasTypeId]);
            return result[0];
        } catch (error) {
            console.error('Error checking gas availability:', error);
            throw error;
        }
    }

    async updateOutletStock(outletId, gasTypeId, quantity) {
        try {
            const query = `
                UPDATE stock_details sd
                JOIN stocks s ON s.id = sd.stock_id
                SET sd.quantity = sd.quantity - ?
                WHERE s.outlet_id = ? AND sd.gas_type_id = ?
            `;
            await this.db.query(query, [quantity, outletId, gasTypeId]);
        } catch (error) {
            console.error('Error updating outlet stock:', error);
            throw error;
        }
    }

    // Request status and creation methods
    async createUserRequest(requestData) {
        try {
            const { 
                userId, 
                outletId, 
                gasTypeId, 
                quantity, 
                token, 
                deliveryDate, 
                pickupPeriodStart, 
                pickupPeriodEnd 
            } = requestData;

            const query = `
                INSERT INTO user_requests (
                    user_id, 
                    outlet_id, 
                    gas_type_id, 
                    quantity, 
                    token, 
                    delivery_date, 
                    pickup_period_start, 
                    pickup_period_end, 
                    request_status,
                    created_at,
                    updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', NOW(), NOW())
            `;
            
            const [result] = await this.db.query(query, [
                userId, 
                outletId, 
                gasTypeId, 
                quantity, 
                token, 
                deliveryDate, 
                pickupPeriodStart, 
                pickupPeriodEnd
            ]);
            
            return result.insertId;
        } catch (error) {
            console.error('Error creating user request:', error);
            throw error;
        }
    }

    async updateRequestStatus(requestId, status) {
        try {
            const query = `
                UPDATE user_requests
                SET 
                    request_status = ?,
                    updated_at = NOW()
                WHERE id = ?
            `;
            await this.db.query(query, [status, requestId]);
        } catch (error) {
            console.error('Error updating request status:', error);
            throw error;
        }
    }

    // Notification methods
    async createNotification(userId, message) {
        try {
            const query = `
                INSERT INTO notifications (
                    user_id, 
                    message, 
                    created_at
                ) VALUES (?, ?, NOW())
            `;
            await this.db.query(query, [userId, message]);
        } catch (error) {
            console.error('Error creating notification:', error);
            throw error;
        }
    }

    async getUserNotifications(userId) {
        try {
            const query = `
                SELECT *
                FROM notifications
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 20
            `;
            const [notifications] = await this.db.query(query, [userId]);
            return notifications;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    }

    async markNotificationRead(notificationId, userId) {
        try {
            const query = `
                UPDATE notifications
                SET read_status = true
                WHERE id = ? AND user_id = ?
            `;
            await this.db.query(query, [notificationId, userId]);
            return this.getNotification(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
            throw error;
        }
    }

    async getScheduledDelivery(outletId, gasTypeId) {
        try {
            const query = `
                SELECT 
                    d.id AS deliveryId,
                    dd.quantity AS quantity
                FROM deliveries d
                JOIN delivery_details dd ON d.id = dd.delivery_id
                WHERE d.outlet_id = ? 
                AND dd.gas_type_id = ? 
                AND d.status = 'Scheduled'
            `;
            
            const [result] = await this.db.query(query, [outletId, gasTypeId]);
            return result[0] || { quantity: 0 }; // Return default if no scheduled delivery
        } catch (error) {
            console.error('Error getting scheduled delivery:', error);
            throw error;
        }
    }

    async getPendingUserRequests(outletId, gasTypeId) {
        try {
            const query = `
                SELECT 
                    id,
                    quantity,
                    request_status
                FROM user_requests
                WHERE outlet_id = ? 
                AND gas_type_id = ? 
                AND request_status = 'Pending'
            `;
            
            const [requests] = await this.db.query(query, [outletId, gasTypeId]);
            return requests;
        } catch (error) {
            console.error('Error getting pending user requests:', error);
            throw error;
        }
    }
}

module.exports = UserRequestRepository;