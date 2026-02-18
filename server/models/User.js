const db = require('../config/DB');
const bcrypt = require('bcrypt');

class User {

    static async createUser({full_name, email, password, phone_number}){
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 
        `INSERT INTO users (full_name, email, password_hash, phone_number)
        VALUES ($1,$2,$3) RETURNING id, full_name, email
        `;

        const values = [full_name, email, hashedPassword, phone_number];

        
        
    }

}
