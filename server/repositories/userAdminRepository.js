class UserAdminRepository {
    constructor(db) {
        this.db = db;
    }

    async getUsersByRole(roleName) {
        try {
            console.log('Executing query for role:', roleName);
            
            const query = `
                SELECT 
                    u.id, 
                    u.name, 
                    u.email,
                    u.phone,
                    u.nic,
                    u.address,
                    u.is_verified,
                    r.role_name
                FROM users u
                INNER JOIN roles r ON u.role_id = r.id
                WHERE r.role_name = ?;
            `;

            const [results] = await this.db.query(query, [roleName]);
            console.log('Query results:', results);
            return results;
        } catch (error) {
            console.error('Database Error:', {
                message: error.message,
                sql: error.sql,
                sqlMessage: error.sqlMessage
            });
            throw error; // Re-throw to be caught by route handler
        }
    }

    async getAdminsAndStockManagers(offset, limit) {
        const query = `
            SELECT 
                u.id, 
                u.name, 
                u.email,
                u.phone,
                u.nic,
                u.address,
                u.is_verified,
                r.role_name AS roleName
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
            WHERE r.role_name IN ('admin', 'stockmanager')
            LIMIT ? OFFSET ?;
        `;

        const countQuery = `
            SELECT COUNT(*) as total
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
            WHERE r.role_name IN ('admin', 'stockmanager');
        `;

        const [[{ total }]] = await this.db.query(countQuery);
        const [users] = await this.db.query(query, [limit, offset]);

        return {
            users,
            totalCount: total
        };
    }
}

module.exports = UserAdminRepository;