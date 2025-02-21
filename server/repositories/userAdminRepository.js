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
    async getUsersWithRoles() {
        const query = `
            SELECT u.id, u.nic, u.name, u.phone, u.email, r.role_name AS role, u.address, u.created_at, u.updated_at
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id;
        `;
        const [users] = await this.db.query(query);
        return users;
    }
    // Delete a user by ID
    async deleteUser(userId) {
    const deleteQuery = `
        DELETE FROM users WHERE id = ?;
    `;
    const [result] = await this.db.query(deleteQuery, [userId]);
    return result;
    }

    async getUserById(userId) {
        const query = `
            SELECT u.id, u.nic, u.name, u.phone, u.email, r.role_name AS role, u.address
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?;
        `;

        const [users] = await this.db.query(query, [userId]);

        return users.length > 0 ? users[0] : null;
    }
    // Update a user's details
    async updateUser(userId, updatedUser) {
    const { name, email, phone, nic, address, role } = updatedUser;

    const updateQuery = `
        UPDATE users
        SET name = ?, email = ?, phone = ?, nic = ?, address = ?, role_id = (SELECT id FROM roles WHERE role_name = ?)
        WHERE id = ?;
    `;

    const [result] = await this.db.query(updateQuery, [name, email, phone, nic, address, role, userId]);
    return result;
}

}

module.exports = UserAdminRepository;
