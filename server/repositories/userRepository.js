class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async nicExists(nic) {
        const query = `SELECT COUNT(*) AS count FROM users WHERE nic = ?`;
        const [rows] = await this.db.query(query, [nic]);
        console.log('NIC Check Result:', rows);
        return rows[0].count > 0;
    }

    async phoneExist(phone) {
        const query = `SELECT COUNT(*) AS count FROM users WHERE phone = ?`;
        const [rows] = await this.db.query(query, [phone]);
        console.log('Phone Check Result:', rows);
        return rows[0].count > 0;
    }

    async createUser(user) {
        const { uid, email, phone, nic, name, address, role, password } = user;

        // Get role ID
        const roleQuery = `SELECT id FROM roles WHERE role_name = ?`;
        const [roleResult] = await this.db.query(roleQuery, [role]);

        if (!roleResult || roleResult.length === 0) {
            throw new Error(`Role '${role}' not found`);
        }

        const roleId = roleResult[0].id;

        // Insert user
        const userQuery = `
            INSERT INTO users (
                role_id, 
                nic, 
                name, 
                phone, 
                email, 
                address,
                password,
                is_verified, 
                created_at, 
                uId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, true, NOW(), ?)
        `;

        const values = [
            roleId,
            nic,
            name,
            phone,
            email,
            address,
            password,
            uid
        ];

        await this.db.query(userQuery, values);
    }

    async getUserByUid(uid) {
        const query = `
            SELECT u.*, r.role_name 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.uId = ?
        `;
        const [rows] = await this.db.query(query, [uid]);
        return rows[0] || null;
    }
}

module.exports = UserRepository;
