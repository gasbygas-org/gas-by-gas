class UserRepository {
    constructor(db) {
        this.db = db;
    }

    async createUser(user) {
        const { uid, name, email, role } = user;
        const query = `
            INSERT INTO users (uid, name, email, role, created_at)
            VALUES (?, ?, ?, ?, NOW());
        `;
        const values = [uid, name, email, role];
        await this.db.query(query, values);
    }
}

module.exports = UserRepository;
