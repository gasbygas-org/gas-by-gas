class UserAdminRepository {
    constructor(db) {
        this.db = db;
    }

    async getUsersByRole(roleName) {
        const query = `
            SELECT u.id, u.name, r.role_name AS roleName
            FROM users u
                     INNER JOIN roles r ON u.role_id = r.id
            WHERE r.role_name = ?;
        `;

        const [results] = await this.db.query(query, [roleName]);
        return results;
    }
}

module.exports = UserAdminRepository;
