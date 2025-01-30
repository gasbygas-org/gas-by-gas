class OutletRepository {
    constructor(db) {
        this.db = db;
    }

    async createOutlet({ outlet_name, address, district, phone, manager_id }) {
        try {
            const query = `
                INSERT INTO outlets 
                (outlet_name, address, district, phone, manager_id, created_at) 
                VALUES (?, ?, ?, ?, ?, NOW())
            `;
            
            const [result] = await this.db.query(query, [
                outlet_name,
                address,
                district,
                phone,
                manager_id
            ]);

            return result.insertId;
        } catch (error) {
            console.error('Error creating outlet:', error);
            throw error;
        }
    }

    async getOutletById(id) {
        const query = `SELECT * FROM outlets WHERE id = ?;`;
        const [rows] = await this.db.query(query, [id]);
        return rows[0] || null;
    }

    async updateOutlet(id, outlet) {
        const { outlet_name, address, district, phone, manager_id } = outlet;

        const query = `
            UPDATE outlets
            SET outlet_name = ?, address = ?, district = ?, phone = ?, manager_id = ?
            WHERE id = ?;
        `;
        await this.db.query(query, [outlet_name, address, district, phone, manager_id, id]);
    }

    async deleteOutlet(id) {
        const query = `DELETE FROM outlets WHERE id = ?;`;
        await this.db.query(query, [id]);
    }

    async getAllOutlets() {
        const query = `
            SELECT 
                o.id,
                o.outlet_name as name,
                o.address,
                o.district,
                o.phone,
                o.manager_id
            FROM outlets o
        `;
        const [outlets] = await this.db.query(query);
        return outlets;
    }

    async getStockLevel(outletId, gasTypeId) {
        const query = `
            SELECT 
                sd.quantity as availableQuantity
            FROM outlets o
            JOIN stocks s ON o.id = s.outlet_id
            JOIN stock_details sd ON s.id = sd.stock_id
            WHERE o.id = ? 
            AND sd.gas_type_id = ?
        `;
        
        const [stock] = await this.db.query(query, [outletId, gasTypeId]);
        return stock[0];
    }
}

module.exports = OutletRepository;
