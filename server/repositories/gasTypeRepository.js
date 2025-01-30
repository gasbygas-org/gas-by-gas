class GasTypeRepository {
    constructor(db) {
        this.db = db;
    }

    async getGasTypesByCategory(category = 'Domestic') {
        const query = `
            SELECT id, gas_type_name, gas_category 
            FROM gas_types 
            WHERE gas_category = ?
            ORDER BY gas_type_name ASC;
        `;
        const [rows] = await this.db.query(query, [category]);
        return rows;
    }
}

module.exports = GasTypeRepository;
