class StockRepository {
    constructor(db) {
        this.db = db;
    }

    // Insert into outlet_request
    async createOutletRequest(outletId, requestStatus, deliveryDate) {
        const query = `
            INSERT INTO outlet_requests (outlet_id, request_status, delivery_date)
            VALUES (?, ?, ?);
        `;
        const [result] = await this.db.query(query, [outletId, requestStatus, deliveryDate]);
        return result.insertId;
    }

    // Insert into outlet_request_details
    async createOutletRequestDetail(outletRequestId, gasTypeId, quantity) {
        const query = `
            INSERT INTO outlet_request_details (outlet_request_id, gas_type_id, quantity)
            VALUES (?, ?, ?);
        `;
        await this.db.query(query, [outletRequestId, gasTypeId, quantity]);
    }
    // Fetch filtered gas requests with pagination
    async filterGasRequests(outletId, status, offset, limit) {
        const query = `
        SELECT 
            \`or\`.id AS requestId,
            \`or\`.outlet_id,
            \`or\`.request_status,
            \`or\`.delivery_date,
            ord.gas_type_id,
            ord.quantity
        FROM outlet_requests AS \`or\`
        INNER JOIN outlet_request_details AS ord
            ON \`or\`.id = ord.outlet_request_id
        WHERE \`or\`.outlet_id = ? AND \`or\`.request_status = ?
    
    `;

        const countQuery = `
        SELECT COUNT(*) AS totalCount
        FROM outlet_requests AS \`or\`
        INNER JOIN outlet_request_details AS ord
            ON \`or\`.id = ord.outlet_request_id
        WHERE \`or\`.outlet_id = ? AND \`or\`.request_status = ?;
    `;

        const [results] = await this.db.query(query, [outletId, status, limit, offset]);

        const [[{ totalCount }]] = await this.db.query(countQuery, [outletId, status]);

        return { results, totalCount };
    }
    async updateGasRequestStatus(requestId, status) {
        const query = `
            UPDATE outlet_requests
            SET request_status = ?
            WHERE id = ?;
        `;

        const [result] = await this.db.query(query, [status, requestId]);

        if (result.affectedRows === 0) {
            throw new Error("Gas request not found or already updated.");
        }

        return { requestId, status };
    }
    async getGasRequestById(requestId) {
        const [result] = await this.db.query(
            `SELECT ord.gas_type_id AS gasTypeId, ord.quantity
        FROM outlet_requests AS outletRequest
        INNER JOIN outlet_request_details AS ord
                ON outletRequest.id = ord.outlet_request_id
        WHERE outletRequest.id = ?`,
            [requestId]
        );
        return result[0];  // Return the first result (as we're expecting only one row)
    }
    


    async updateRequestStatus(requestId, status) {
        await this.db.query("UPDATE user_requests SET request_status = ? WHERE id = ?", [status, requestId]);
    }

    async reduceHeadOfficeStock(gasTypeId, quantity) {
        await this.db.query(
            "UPDATE head_office_stocks SET quantity = quantity - ? WHERE gas_type_id = ?",
            [quantity, gasTypeId]
        );
    }

    async getOutletManagers(outletId) {
        const [results] = await this.db.query(
            `SELECT u.email 
        FROM users u 
        INNER JOIN outlets o ON o.manager_id = u.id 
        WHERE o.id = ?`,
            [outletId]
        );
        return results;
    }


    async getPendingUsers(outletId) {
        const [results] = await this.db.query(
            "SELECT email FROM users WHERE id IN (SELECT user_id FROM user_requests WHERE outlet_id = ? AND request_status = 'Pending')",
            [outletId]
        );
        return results;
    }
    async getStockByOutletId(outletId) {
        const [results] = await this.db.query(
            "SELECT id FROM stocks WHERE outlet_id = ?",
            [outletId]
        );
        return results[0];
    }
    async createStock(outletId) {
        const [result] = await this.db.query(
            "INSERT INTO stocks (outlet_id) VALUES (?)",
            [outletId]
        );
        return result.insertId;
    }
    async getStockDetail(stockId, gasTypeId) {
        const [results] = await this.db.query(
            "SELECT id, quantity FROM stock_details WHERE stock_id = ? AND gas_type_id = ?",
            [stockId, gasTypeId]
        );
        return results[0];
    }
    async createStockDetail(stockId, gasTypeId, quantity) {
        await this.db.query(
            "INSERT INTO stock_details (stock_id, gas_type_id, quantity) VALUES (?, ?, ?)",
            [stockId, gasTypeId, quantity]
        );
    }
    async updateStockDetailQuantity(stockId, gasTypeId, quantity) {
        await this.db.query(
            "UPDATE stock_details SET quantity = quantity + ? WHERE stock_id = ? AND gas_type_id = ?",
            [quantity, stockId, gasTypeId]
        );
    }
    async updateRequestStatus(requestId, status) {
        await this.db.query(
            "UPDATE outlet_requests SET request_status = ? WHERE id = ?",
            [status, requestId]
        );
    }
    async createDelivery(outletId, requestId, status) {
        const [result] = await this.db.query(
            `INSERT INTO deliveries (outlet_id, request_id, delivery_date, status) VALUES (?, ?, CURDATE(), ?)`,
            [outletId, requestId, status]
        );
        return result.insertId;
    }
    
    async createDeliveryDetail(deliveryId, gasTypeId, quantity) {
        await this.db.query(
            `INSERT INTO delivery_details (delivery_id, gas_type_id, quantity) VALUES (?, ?, ?)`,
            [deliveryId, gasTypeId, quantity]
        );
    }
    async getGasRequestDetailsByRequestId(requestId) {
        const [result] = await this.db.query(
            `SELECT 
                d.outlet_id AS outletId,
                dd.gas_type_id AS gasTypeId,
                dd.quantity AS quantity
             FROM 
                deliveries AS d
             INNER JOIN 
                delivery_details AS dd
                ON d.id = dd.delivery_id
             WHERE 
                d.request_id = ?`,
            [requestId]
        );
        
        if (result.length > 0) {
            return result[0]; 
        } else {
            return null;
        }
    }
    async updateDeliveryStatus(requestId, status) {
        const [result] = await this.db.query(
            `UPDATE deliveries 
             SET status = ? 
             WHERE request_id = ?`,
            [status, requestId]
        );
        return result.affectedRows > 0;
    }
      
}
module.exports = StockRepository;
