class StockRepository {
    constructor(db) {
        this.db = db;
    }

    // Insert into outlet_request
    async createOutletRequest(outletId, requestStatus/*, deliveryDate*/) {
        const query = `
            INSERT INTO outlet_requests (outlet_id, request_status)
            VALUES (?, ?);
        `;
        // INSERT INTO outlet_requests (outlet_id, request_status, delivery_date) VALUES (?, ?, ?);

        const [result] = await this.db.query(query, [outletId, requestStatus/*, deliveryDate*/]);
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
            \`or\`.id AS id,
            \`or\`.outlet_id,
            \`or\`.request_status,
            \`or\`.delivery_date,
            ord.gas_type_id,
            ord.quantity,
            gt.gas_type_name AS gas_type,
            DATE_FORMAT(or.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(or.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
        FROM outlet_requests AS \`or\`
        INNER JOIN outlet_request_details AS ord
            ON \`or\`.id = ord.outlet_request_id
        INNER JOIN gas_types AS gt
            ON \`gt\`.id = ord.gas_type_id
        WHERE \`or\`.outlet_id = ?
        ORDER BY or.id DESC
        LIMIT ? OFFSET ?
    `;
        //  AND \`or\`.request_status = ?

        const countQuery = `
        SELECT COUNT(*) AS totalCount
        FROM outlet_requests AS \`or\`
        INNER JOIN outlet_request_details AS ord
            ON \`or\`.id = ord.outlet_request_id
        INNER JOIN gas_types AS gt
            ON \`gt\`.id = ord.gas_type_id
        WHERE \`or\`.outlet_id = ?;
    `;
        //  AND \`or\`.request_status = ?

        const [results] = await this.db.query(query, [outletId/*, status*/, limit, offset]);

        const [[{ totalCount }]] = await this.db.query(countQuery, [outletId/*, status*/]);

        return { results, totalCount };
    }

    async getAllGasRequests(query, status, offset, limit) {
        const filters = [];
        const params = [];

        if (query) {
            filters.push("(o.outlet_name LIKE ? OR o.address LIKE ? OR o.district LIKE ?)");
            params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        if (status) {
            filters.push("or.request_status = ?");
            params.push(status);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const queryStatement = `
            SELECT 
                \`or\`.id AS id,
                \`or\`.outlet_id,
                CONCAT(o.outlet_name, ', ', o.address, ' (', o.district, ')') AS outlet,
                \`or\`.request_status,
                \`or\`.delivery_date,
                ord.gas_type_id,
                COALESCE(
                    (SELECT dd.quantity 
                     FROM deliveries d 
                     INNER JOIN delivery_details dd ON d.id = dd.delivery_id 
                     WHERE d.outlet_request_id = \`or\`.id AND dd.gas_type_id = ord.gas_type_id 
                     LIMIT 1), 
                    ord.quantity
                ) AS quantity,
                gt.gas_type_name AS gas_type,
                DATE_FORMAT(\`or\`.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
                DATE_FORMAT(\`or\`.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
            FROM outlet_requests AS \`or\`
            INNER JOIN outlet_request_details AS ord
                ON \`or\`.id = ord.outlet_request_id
            INNER JOIN outlets AS o
                ON \`or\`.outlet_id = o.id
            INNER JOIN gas_types AS gt
                ON gt.id = ord.gas_type_id
            ${whereClause}
            ORDER BY \`or\`.id DESC
            LIMIT ? OFFSET ?;
        `;

        const countQuery = `
            SELECT COUNT(*) AS totalCount
            FROM outlet_requests AS \`or\`
            INNER JOIN outlet_request_details AS ord
                ON \`or\`.id = ord.outlet_request_id
            INNER JOIN outlets AS o
                ON \`or\`.outlet_id = o.id
            INNER JOIN gas_types AS gt
                ON gt.id = ord.gas_type_id
            ${whereClause};
        `;

        params.push(limit, offset);

        const [results] = await this.db.query(queryStatement, params);
        const [[{ totalCount }]] = await this.db.query(countQuery, params.slice(0, -2));

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
            `INSERT INTO deliveries (outlet_id, outlet_request_id, delivery_date, status) VALUES (?, ?, CURDATE(), ?)`,
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

    // Create a new stock entry
    async createStock(outletId) {
        const query = `
            INSERT INTO stocks (outlet_id) 
            VALUES (?);
        `;
        const [result] = await this.db.query(query, [outletId]);
        return result.insertId;
    }

    // Add stock details
    async createStockDetail(stockId, gasTypeId, quantity) {
        const query = `
            INSERT INTO stock_details (stock_id, gas_type_id, quantity) 
            VALUES (?, ?, ?);
        `;
        await this.db.query(query, [stockId, gasTypeId, quantity]);
    }

    // Get all stocks with search and filter
    async getAllStocks(query, gasTypeId) {
        const filters = [];
        const params = [];

        if (query) {
            filters.push("(o.outlet_name LIKE ? OR o.address LIKE ? OR o.district LIKE ?)");
            params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }

        if (gasTypeId) {
            filters.push("sd.gas_type_id = ?");
            params.push(gasTypeId);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const queryStatement = `
            SELECT 
                s.id AS stock_id,
                o.id AS outlet_id,
                o.outlet_name,
                o.address,
                o.district,
                gt.id AS gas_type_id,
                gt.gas_type_name,
                sd.quantity,
                s.created_at,
                s.updated_at
            FROM 
                stocks AS s
            INNER JOIN 
                outlets AS o ON s.outlet_id = o.id
            INNER JOIN 
                stock_details AS sd ON s.id = sd.stock_id
            INNER JOIN 
                gas_types AS gt ON sd.gas_type_id = gt.id
            ${whereClause}
            ORDER BY s.id DESC;
        `;

        const [results] = await this.db.query(queryStatement, params);
        return results;
    }

    // Update stock quantity
    async updateStockDetail(stockId, gasTypeId, quantity) {
        const query = `
            UPDATE stock_details 
            SET quantity = ? 
            WHERE stock_id = ? AND gas_type_id = ?;
        `;
        await this.db.query(query, [quantity, stockId, gasTypeId]);
    }

    // Delete stock
    async deleteStock(stockId) {
        const query = `
            DELETE FROM stocks 
            WHERE id = ?;
        `;
        await this.db.query(query, [stockId]);
    }

    // Delete stock details
    async deleteStockDetails(stockId) {
        const query = `
            DELETE FROM stock_details 
            WHERE stock_id = ?;
        `;
        await this.db.query(query, [stockId]);
    }
}

module.exports = StockRepository;
