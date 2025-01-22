class OutletRepository {
    constructor(db) {
        this.db = db;
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

}

module.exports = OutletRepository;
//
