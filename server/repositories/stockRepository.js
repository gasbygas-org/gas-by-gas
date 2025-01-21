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

}
module.exports = StockRepository;
