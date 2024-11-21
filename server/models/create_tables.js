const dbaccess = require('./db_access');
const config = require('../config.json'); // load configuration

function sendQueryOrCommand(db, query, params = []) {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

async function create_tables(db) {

    // Users table
    var q1 = db.create_tables('CREATE TABLE IF NOT EXISTS users ( \
        user_id int PRIMARY KEY AUTO_INCREMENT, \
        username VARCHAR(255), \
        hashed_password VARCHAR(255), \
        first_name VARCHAR(255), \
        last_name VARCHAR(255) \
        );'
    );

    // gpus table
    var q2 = db.create_tables('CREATE TABLE IF NOT EXISTS gpus ( \
        gpu_id VARCHAR(255) PRIMARY KEY, \
        model VARCHAR(255), \
        user_id int, \
        FOREIGN KEY (user_id) REFERENCES users(user_id) \
        );'
    );

    return await Promise.all([q1, q2]);
}

// Database connection setup
dbaccess.get_db_connection();

create_tables(dbaccess)
    .then(_ => {
        console.log('Tables created');
        dbaccess.close_db();
    })