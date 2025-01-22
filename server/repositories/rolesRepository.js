class RolesRepository {
    constructor(db) {
        this.db = db;
    }

    //get admin roles
    async getRolesExcludingUser() {
        const query = `SELECT * FROM roles WHERE role_name != 'user';`;
        const [roles] = await this.db.query(query);
        return roles;
    }

    //get user roles
    async getUserRoles() {
        const query = `SELECT * FROM roles WHERE role_name IN ('normal user', 'professional user');`;
        const [roles] = await this.db.query(query);
        return roles;
    }
}

module.exports = RolesRepository;
