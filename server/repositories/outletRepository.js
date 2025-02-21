class OutletRepository {
    constructor(db) {
        this.db = db;
    }

    async getAllOutlets() {
        const query = `
            SELECT id, outlet_name, address, district, phone, manager_id 
            FROM outlets 
            ORDER BY outlet_name ASC;
        `;
        const [rows] = await this.db.query(query);
        return rows;
    }

    async createOutlet(outlet) {
        const { outlet_name, address, district, phone, manager_id } = outlet;

        const query = `
            INSERT INTO outlets (outlet_name, address, district, phone, manager_id, created_at,status)
            VALUES (?, ?, ?, ?, ?, NOW(),'ACTIVE');
        `;
        await this.db.query(query, [outlet_name, address, district, phone, manager_id]);
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
        const query = `UPDATE outlets SET status = 'DELETED' WHERE id = ?;`;
        await this.db.query(query, [id]);
    }
    
    async getAllOutletsWithManager() {
        const query = `
            SELECT o.id, o.outlet_name, o.address, o.district, o.phone, u.name AS manager_name, o.created_at, o.updated_at
            FROM outlets o
            LEFT JOIN users u ON o.manager_id = u.id;
        `;
        const [outlets] = await this.db.query(query);
        return outlets;
    }

}

module.exports = OutletRepository;
//
