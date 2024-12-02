import * as dbaccess from './db_access.js';
import config from '../config.json' assert { type: 'json' };

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

    // RAMP results table
    var q3 = db.create_tables('CREATE TABLE IF NOT EXISTS ramp_model_results ( \
        id int PRIMARY KEY AUTO_INCREMENT, \
        gpu_id VARCHAR(255), \
        timestamp DATETIME NOT NULL, \
        temperature FLOAT NOT NULL, \
        voltage FLOAT NOT NULL, \
        power_usage FLOAT NOT NULL, \
        delta_t FLOAT NOT NULL, \
        mttf_em FLOAT NOT NULL, \
        mttf_sm FLOAT NOT NULL, \
        mttf_tddb FLOAT NOT NULL, \
        mttf_tc FLOAT NOT NULL, \
        mttf_overall FLOAT NOT NULL, \
        FOREIGN KEY (gpu_id) REFERENCES gpus(gpu_id) \
    );');

    return await Promise.all([q1, q2, q3]);
}

// Database connection setup
dbaccess.get_db_connection();

create_tables(dbaccess)
    .then(_ => {
        console.log('Tables created');
        dbaccess.close_db();
    })