import mysql from 'mysql';
import config from '../config.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

let the_db = null;

// Export functions as named exports
export async function get_db_connection() {
    if (the_db) {
        return Promise.resolve(the_db);
    }

    const dbconfig = { ...config.database };
    dbconfig.user = config.database.user;
    dbconfig.password = config.database.password;

    the_db = mysql.createConnection(dbconfig);

    console.log(dbconfig, dbconfig.user, dbconfig.password);

    // Connect to MySQL
    return new Promise((resolve, reject) => {
        the_db.connect(err => {
            if (err) {
                console.error('Failed to connect to MySQL:', err);
                reject(err);
            } else {
                console.log('Connected to MySQL server.');
                resolve(the_db);
            }
        });
    });
}

export function close_db() {
    if (the_db) {
        the_db.end();
        the_db = null;
    }
}

export async function send_sql(sql, params = []) {
    const dbo = await get_db_connection();
    return new Promise((resolve, reject) => {
        dbo.query(sql, params, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

export async function create_tables(query, params = []) {
    return send_sql(query, params);
}

export async function insert_items(query, params = []) {
    const result = await send_sql(query, params);
    return result.affectedRows;
}

export function set_db_connection(db) {
    the_db = db;
}
